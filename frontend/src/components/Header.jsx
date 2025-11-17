import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import './Header.css'

function Header() {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
    if (savedMode) {
      document.body.classList.add('dark-mode')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    document.body.classList.toggle('dark-mode')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <h1>🏃 Fitness Platform</h1>
        </Link>
        
        {user ? (
          <nav className="header-nav">
            <Link to="/" className="nav-link">Timeline</Link>
            <Link to="/groups" className="nav-link">Groups</Link>
            <Link to="/challenges" className="nav-link">Challenges</Link>
            <Link to="/activities" className="nav-link">Activities</Link>
            <Link to={`/profile/${user.username}`} className="nav-link">👤 {user.username}</Link>
            <button onClick={toggleDarkMode} className="btn btn-icon">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </nav>
        ) : (
          <nav className="header-nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
