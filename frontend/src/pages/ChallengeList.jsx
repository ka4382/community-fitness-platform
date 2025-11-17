import { useState, useEffect } from 'react'
import { challengesAPI } from '../services/api'

function ChallengeList() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await challengesAPI.list()
      setChallenges(response.data.results || response.data)
    } catch (err) {
      setError('Failed to load challenges')
      console.error('Error fetching challenges:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinChallenge = async (challengeId) => {
    try {
      await challengesAPI.join(challengeId)
      alert('Joined challenge successfully!')
      fetchChallenges()
    } catch (err) {
      console.error('Error joining challenge:', err)
      alert('Failed to join challenge')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      <h1>Challenges</h1>

      {loading && <p>Loading challenges...</p>}
      {error && <div className="error-message">{error}</div>}

      <div className="group-grid">
        {challenges.length === 0 && !loading && (
          <div className="card">
            <p>No active challenges yet.</p>
          </div>
        )}

        {challenges.map((challenge) => (
          <div key={challenge.id} className="card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <p className="text-secondary">
              <strong>Metric:</strong> {challenge.metric}
            </p>
            <p className="text-secondary">
              {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
            </p>
            <p className="text-secondary">
              {challenge.participants_count} participants
            </p>
            <button 
              onClick={() => handleJoinChallenge(challenge.id)}
              className="btn btn-primary"
              style={{ marginTop: '10px' }}
            >
              Join Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChallengeList
