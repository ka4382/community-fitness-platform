import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { groupsAPI } from '../services/api'

function GroupList() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    is_private: false
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await groupsAPI.list()
      setGroups(response.data.results || response.data)
    } catch (err) {
      setError('Failed to load groups')
      console.error('Error fetching groups:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      await groupsAPI.join(groupId)
      alert('Joined group successfully!')
      fetchGroups()
    } catch (err) {
      console.error('Error joining group:', err)
      alert('Failed to join group')
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    try {
      await groupsAPI.create(newGroup)
      setShowCreateModal(false)
      setNewGroup({ name: '', description: '', is_private: false })
      alert('Group created successfully!')
      fetchGroups()
    } catch (err) {
      console.error('Error creating group:', err)
      alert('Failed to create group')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Groups</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          ➕ Create Group
        </button>
      </div>

      {loading && <p>Loading groups...</p>}
      {error && <div className="error-message">{error}</div>}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's your group about?"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={newGroup.is_private}
                    onChange={(e) => setNewGroup({ ...newGroup, is_private: e.target.checked })}
                  />
                  <span>Private Group</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">
                  Create Group
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="group-grid">
        {groups.length === 0 && !loading && (
          <div className="card">
            <p>No groups available yet.</p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.id} className="card">
            <h3>{group.name}</h3>
            <p>{group.description || 'No description'}</p>
            <p className="text-secondary">
              {group.members_count} {group.members_count === 1 ? 'member' : 'members'}
              {group.is_private && ' • Private'}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <Link to={`/groups/${group.id}`} className="btn btn-primary">
                View Group
              </Link>
              <button 
                onClick={() => handleJoinGroup(group.id)}
                className="btn btn-secondary"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupList
