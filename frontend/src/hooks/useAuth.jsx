import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      const response = await authAPI.login({ username, password })
      const { access, refresh } = response.data
      
      // Store tokens
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      // Fetch user data
      const userResponse = await authAPI.getMe()
      const userData = userResponse.data
      
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      let errorMessage = 'Login failed'
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors[0]
        }
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (username, email, password, full_name) => {
    try {
      setError(null)
      await authAPI.register({ username, email, password, full_name })
      
      // Auto-login after registration
      return await login(username, password)
    } catch (err) {
      let errorMessage = 'Registration failed'
      
      if (err.response?.data) {
        const errors = err.response.data
        // Handle field-specific errors
        if (errors.username) {
          errorMessage = `Username: ${errors.username[0] || errors.username}`
        } else if (errors.email) {
          errorMessage = `Email: ${errors.email[0] || errors.email}`
        } else if (errors.password) {
          errorMessage = `Password: ${errors.password[0] || errors.password}`
        } else if (errors.detail) {
          errorMessage = errors.detail
        } else if (typeof errors === 'string') {
          errorMessage = errors
        }
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
