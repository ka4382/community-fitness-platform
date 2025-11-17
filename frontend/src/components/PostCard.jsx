import { useState } from 'react'
import { postsAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import CommentSection from './CommentSection'
import './PostCard.css'

function PostCard({ post, onLike, onDelete }) {
  const { user } = useAuth()
  const [liking, setLiking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [comments, setComments] = useState(post.comments || [])

  const handleLike = async () => {
    if (liking) return
    
    try {
      setLiking(true)
      const response = await postsAPI.like(post.id)
      setLikeCount(response.data.like_count)
      if (onLike) onLike(post.id)
    } catch (error) {
      console.error('Failed to like post:', error)
    } finally {
      setLiking(false)
    }
  }

  const handleDelete = async () => {
    if (deleting) return
    if (!window.confirm('Are you sure you want to delete this post?')) return
    
    try {
      setDeleting(true)
      await postsAPI.delete(post.id)
      if (onDelete) onDelete(post.id)
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <strong>{post.author}</strong>
          <span className="post-date">{formatDate(post.created_at)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="post-visibility">{post.visibility}</span>
          {user && post.author === user.username && (
            <button 
              onClick={handleDelete}
              className="btn-delete"
              disabled={deleting}
              title="Delete post"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="post-content">
        {post.text && <p>{post.text}</p>}
        {post.media_url && post.media_url.trim() !== '' && (
          <img 
            src={post.media_url} 
            alt="Post media" 
            className="post-media"
            onError={(e) => {
              e.target.style.display = 'none'
              console.error('Failed to load image:', post.media_url)
            }}
          />
        )}
      </div>

      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className="btn-like"
          disabled={liking}
        >
          ❤️ {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
        <span className="post-comments">💬 {comments.length} Comments</span>
      </div>

      <CommentSection 
        postId={post.id} 
        comments={comments} 
        onCommentAdded={(newComment) => setComments([newComment, ...comments])}
      />
    </div>
  )
}

export default PostCard
