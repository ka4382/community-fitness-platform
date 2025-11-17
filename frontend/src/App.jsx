import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Timeline from './pages/Timeline'
import CreatePost from './pages/CreatePost'
import GroupPage from './pages/GroupPage'
import GroupList from './pages/GroupList'
import ChallengeList from './pages/ChallengeList'
import ActivityLog from './pages/ActivityLog'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Timeline /></PrivateRoute>} />
            <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/groups" element={<PrivateRoute><GroupList /></PrivateRoute>} />
            <Route path="/groups/:groupId" element={<PrivateRoute><GroupPage /></PrivateRoute>} />
            <Route path="/challenges" element={<PrivateRoute><ChallengeList /></PrivateRoute>} />
            <Route path="/activities" element={<PrivateRoute><ActivityLog /></PrivateRoute>} />
            <Route path="/profile/:username" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
