import { useState } from 'react'
import { activitiesAPI } from '../services/api'

function ActivityLog() {
  const [formData, setFormData] = useState({
    type: 'walk',
    steps: '',
    duration_minutes: '',
    distance_km: '',
    calories: '',
    timestamp: new Date().toISOString().slice(0, 16)
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)

    try {
      await activitiesAPI.create({
        ...formData,
        steps: parseInt(formData.steps) || 0,
        duration_minutes: parseInt(formData.duration_minutes) || null,
        distance_km: parseFloat(formData.distance_km) || null,
        calories: parseInt(formData.calories) || null,
      })
      setSuccess(true)
      // Reset form
      setFormData({
        type: 'walk',
        steps: '',
        duration_minutes: '',
        distance_km: '',
        calories: '',
        timestamp: new Date().toISOString().slice(0, 16)
      })
    } catch (err) {
      setError('Failed to log activity')
      console.error('Error logging activity:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Log Activity</h1>

      <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div style={{ 
            background: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px' 
          }}>
            Activity logged successfully! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Type</label>
            <select
              name="type"
              className="form-input"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="walk">Walk</option>
              <option value="run">Run</option>
              <option value="cycle">Cycle</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Steps</label>
            <input
              type="number"
              name="steps"
              className="form-input"
              value={formData.steps}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              name="duration_minutes"
              className="form-input"
              value={formData.duration_minutes}
              onChange={handleChange}
              placeholder="30"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Distance (km)</label>
            <input
              type="number"
              step="0.1"
              name="distance_km"
              className="form-input"
              value={formData.distance_km}
              onChange={handleChange}
              placeholder="5.0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Calories Burned</label>
            <input
              type="number"
              name="calories"
              className="form-input"
              value={formData.calories}
              onChange={handleChange}
              placeholder="250"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <input
              type="datetime-local"
              name="timestamp"
              className="form-input"
              value={formData.timestamp}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging...' : 'Log Activity'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ActivityLog
