import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { groupsAPI } from '../services/api'
import ChatRoom from '../components/ChatRoom'

function GroupPage() {
  const { groupId } = useParams()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGroup()
  }, [groupId])

  const fetchGroup = async () => {
    try {
      setLoading(true)
      const response = await groupsAPI.get(groupId)
      setGroup(response.data)
    } catch (err) {
      setError('Failed to load group')
      console.error('Error fetching group:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading group...</p>
  if (error) return <div className="error-message">{error}</div>
  if (!group) return <p>Group not found</p>

  return (
    <div>
      <div className="card">
        <h1>{group.name}</h1>
        <p>{group.description}</p>
        <p className="text-secondary">
          {group.members_count} {group.members_count === 1 ? 'member' : 'members'}
          {group.is_private && ' • Private Group'}
        </p>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>Group Chat</h2>
      <ChatRoom groupId={groupId} />
    </div>
  )
}

export default GroupPage
