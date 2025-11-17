import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post('/api/auth/token/refresh/', {
            refresh: refreshToken,
          })
          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  getMe: () => api.get('/auth/me/'),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
}

// Posts API
export const postsAPI = {
  list: (params) => api.get('/posts/', { params }),
  create: (data) => api.post('/posts/', data),
  get: (id) => api.get(`/posts/${id}/`),
  like: (id) => api.post(`/posts/${id}/like/`),
  delete: (id) => api.delete(`/posts/${id}/`),
}

// Activities API
export const activitiesAPI = {
  list: (params) => api.get('/activities/', { params }),
  create: (data) => api.post('/activities/', data),
  get: (id) => api.get(`/activities/${id}/`),
}

// Challenges API
export const challengesAPI = {
  list: (params) => api.get('/challenges/', { params }),
  get: (id) => api.get(`/challenges/${id}/`),
  join: (id) => api.post(`/challenges/${id}/join/`),
  leaderboard: (id) => api.get(`/challenges/${id}/leaderboard/`),
}

// Groups API
export const groupsAPI = {
  list: (params) => api.get('/groups/', { params }),
  create: (data) => api.post('/groups/', data),
  get: (id) => api.get(`/groups/${id}/`),
  join: (id) => api.post(`/groups/${id}/join/`),
  leave: (id) => api.post(`/groups/${id}/leave/`),
  getMessages: (id) => api.get(`/groups/${id}/messages/`),
}

// Notifications API
export const notificationsAPI = {
  list: (params) => api.get('/notifications/', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/`, { is_read: true }),
}

export default api
