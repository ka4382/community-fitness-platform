import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsAPI } from '../services/api'

function CreatePost() {
  const [formData, setFormData] = useState({
    text: '',
    media_url: '',
    visibility: 'public'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await postsAPI.create(formData)
      navigate('/')
    } catch (err) {
      setError('Failed to create post')
      console.error('Error creating post:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Create New Post</h1>

      <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">What's on your mind?</label>
            <textarea
              name="text"
              className="form-textarea"
              value={formData.text}
              onChange={handleChange}
              placeholder="Share your fitness journey..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Media URL (optional)</label>
            <input
              type="url"
              name="media_url"
              className="form-input"
              value={formData.media_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visibility</label>
            <select
              name="visibility"
              className="form-input"
              value={formData.visibility}
              onChange={handleChange}
            >
              <option value="public">Public</option>
              <option value="group">Group Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
