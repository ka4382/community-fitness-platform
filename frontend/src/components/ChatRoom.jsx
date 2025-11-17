import { useState, useEffect, useRef } from 'react'
import { useGroupChat } from '../hooks/useGroupChat'
import { groupsAPI } from '../services/api'
import './ChatRoom.css'

function ChatRoom({ groupId }) {
  const [messageText, setMessageText] = useState('')
  const { messages, connected, error, sendMessage } = useGroupChat(groupId)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const messagesEndRef = useRef(null)

  // Fetch message history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await groupsAPI.getMessages(groupId)
        // Messages are handled by WebSocket, this is a fallback
        console.log('Message history:', response.data)
      } catch (err) {
        console.error('Failed to fetch message history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }

    if (groupId) {
      fetchHistory()
    }
  }, [groupId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (messageText.trim() && connected) {
      sendMessage(messageText.trim())
      setMessageText('')
    }
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h3>Group Chat</h3>
        <span className={`chat-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      {error && (
        <div className="chat-error">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-messages">
        {loadingHistory && messages.length === 0 && (
          <div className="chat-loading">Loading messages...</div>
        )}

        {messages.length === 0 && !loadingHistory && (
          <div className="chat-empty">No messages yet. Start the conversation!</div>
        )}

        {messages.map((msg, index) => (
          <div key={msg.id || index} className="chat-message">
            <div className="chat-message-author">
              {msg.sender?.full_name || msg.sender?.username || msg.author || 'Unknown'}
            </div>
            <div className="chat-message-text">{msg.text || msg.message}</div>
            <div className="chat-message-time">
              {new Date(msg.created_at || msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={!connected}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!connected || !messageText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
