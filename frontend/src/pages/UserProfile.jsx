import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './UserProfile.css'

function UserProfile() {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    fetchProfile()
    fetchPosts()
    if (currentUser && username !== currentUser.username) {
      checkFollowing()
    }
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/auth/profile/${username}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const userPosts = (data.results || data).filter(p => p.author === username)
        setPosts(userPosts)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const checkFollowing = async () => {
    try {
      const response = await fetch(`/api/auth/check-following/${username}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.following)
      }
    } catch (error) {
      console.error('Failed to check following:', error)
    }
  }

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow'
      const response = await fetch(`/api/auth/${endpoint}/${username}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        setIsFollowing(!isFollowing)
        fetchProfile()
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>User not found</div>

  const isOwnProfile = currentUser && currentUser.username === username

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} />
          ) : (
            <div className="avatar-placeholder">{profile.username[0].toUpperCase()}</div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="profile-name-row">
            <h1>{profile.full_name || profile.username}</h1>
            {isOwnProfile ? (
              <Link to="/profile/edit" className="btn btn-secondary">Edit Profile</Link>
            ) : (
              <button 
                onClick={handleFollow}
                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          
          <div className="profile-stats">
            <div className="stat">
              <strong>{profile.posts_count || 0}</strong>
              <span>Posts</span>
            </div>
            <div className="stat">
              <strong>{profile.followers_count || 0}</strong>
              <span>Followers</span>
            </div>
            <div className="stat">
              <strong>{profile.following_count || 0}</strong>
              <span>Following</span>
            </div>
            <div className="stat">
              <strong>{profile.total_steps?.toLocaleString() || 0}</strong>
              <span>Steps</span>
            </div>
            <div className="stat">
              <strong>{profile.total_calories?.toLocaleString() || 0}</strong>
              <span>Calories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-grid">
            {posts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-preview">
                  <p>{post.text}</p>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'activities' && (
          <div>
            <p>Activity tracking coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
