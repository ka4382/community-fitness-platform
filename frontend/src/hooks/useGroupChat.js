import { useState, useEffect, useRef, useCallback } from 'react'

export function useGroupChat(groupId) {
  const [messages, setMessages] = useState([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)

  const connect = useCallback(() => {
    if (!groupId) return

    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('No authentication token found')
      return
    }

    // Construct WebSocket URL - for local dev, connect directly to backend port
    const isDev = import.meta.env.DEV
    const wsHost = isDev ? 'localhost:8000' : window.location.host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${wsHost}/ws/groups/${groupId}/?token=${token}`

    try {
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === 'chat_message') {
          setMessages((prev) => [...prev, data.message])
        } else if (data.type === 'message_history') {
          setMessages(data.messages)
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('WebSocket connection error')
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setConnected(false)
      }

      wsRef.current = ws
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      setError('Failed to connect to chat')
    }
  }, [groupId])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setConnected(false)
    }
  }, [])

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        message: message,
      }))
    } else {
      setError('WebSocket is not connected')
    }
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return {
    messages,
    connected,
    error,
    sendMessage,
    reconnect: connect,
  }
}
