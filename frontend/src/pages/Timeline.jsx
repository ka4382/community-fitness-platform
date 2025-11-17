import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI } from '../services/api'
import PostCard from '../components/PostCard'

function Timeline() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await postsAPI.list()
      setPosts(response.data.results || response.data)
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (postId) => {
    // Optimistically update the UI
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, like_count: post.like_count + 1 }
        : post
    ))
  }

  const handleDelete = (postId) => {
    // Remove post from UI
    setPosts(posts.filter(post => post.id !== postId))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Timeline</h1>
        <Link to="/create-post" className="btn btn-primary">
          ✍️ Create Post
        </Link>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <div className="error-message">{error}</div>}

      <div className="post-grid">
        {posts.length === 0 && !loading && (
          <div className="card">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default Timeline
