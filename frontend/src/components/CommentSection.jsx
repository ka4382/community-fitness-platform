import { useState } from 'react'
import './CommentSection.css'

function CommentSection({ postId, comments = [], onCommentAdded }) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ text: newComment, post: postId })
      })

      if (response.ok) {
        const comment = await response.json()
        setNewComment('')
        if (onCommentAdded) onCommentAdded(comment)
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comment-section">
      <button 
        className="toggle-comments"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? '▼' : '▶'} {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </button>

      {showComments && (
        <div className="comments-container">
          <form onSubmit={handleSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
            />
            <button type="submit" disabled={loading || !newComment.trim()} className="btn btn-primary">
              Post
            </button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection
