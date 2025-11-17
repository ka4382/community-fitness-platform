# Frontend - Community Engagement Fitness Platform

React 18 + Vite frontend application with JWT authentication, WebSocket chat, and responsive UI.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS variables
- **Real-time**: WebSocket API for group chat

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with auth state
│   ├── Footer.jsx      # Page footer
│   ├── PostCard.jsx    # Social post card with like functionality
│   └── ChatRoom.jsx    # WebSocket-based group chat
├── pages/              # Route pages
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Timeline.jsx    # Main feed of posts
│   ├── CreatePost.jsx  # Create new post
│   ├── GroupList.jsx   # List all groups
│   ├── GroupPage.jsx   # Group detail with chat
│   ├── ChallengeList.jsx # List challenges
│   └── ActivityLog.jsx # Log fitness activities
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication logic and token management
│   └── useGroupChat.js # WebSocket chat connection
├── services/           # API service layer
│   └── api.js          # Axios instance with interceptors
├── App.jsx             # Root component with routing
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## Features

### Authentication
- JWT token-based authentication
- Auto-refresh tokens on expiration
- Persistent login via localStorage
- Protected routes for authenticated users

### Token Storage
Tokens are stored in `localStorage`:
- `access_token` - JWT access token (7-day expiry)
- `refresh_token` - JWT refresh token (30-day expiry)
- `user` - User profile data (JSON string)

The `api.js` service automatically:
1. Attaches access token to all requests
2. Intercepts 401 responses
3. Attempts to refresh the token
4. Retries the original request
5. Logs out user if refresh fails

### Real-time Chat
- WebSocket connection to `/ws/groups/:groupId/?token=<JWT>`
- Automatic reconnection on disconnect
- Message history fetching from REST API
- Live message updates

### API Integration
All API calls use the centralized `api.js` service with base URL `/api/`:
- `/auth/` - Registration, login, token refresh, user profile
- `/posts/` - CRUD operations, like functionality
- `/activities/` - Log and view activities
- `/challenges/` - List, join challenges, view leaderboards
- `/groups/` - List, join/leave groups, chat messages
- `/notifications/` - User notifications

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

The Vite dev server proxies API requests:
- `/api/*` → `http://localhost:8000/api/*`
- `/ws/*` → `ws://localhost:8000/ws/*`

### Build for Production
```bash
npm run build
```
Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Environment Configuration

The app expects the backend API at:
- **Development**: `http://localhost:8000/api/` (via Vite proxy)
- **Production**: Same origin (`/api/`)

For custom backend URLs, update `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8000',
      changeOrigin: true,
    }
  }
}
```

## Component Usage

### useAuth Hook
```javascript
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  const handleLogin = async () => {
    const result = await login(username, password)
    if (result.success) {
      // Login successful
    }
  }
}
```

### useGroupChat Hook
```javascript
import { useGroupChat } from './hooks/useGroupChat'

function ChatComponent({ groupId }) {
  const { messages, connected, sendMessage } = useGroupChat(groupId)
  
  const handleSend = () => {
    sendMessage('Hello, group!')
  }
}
```

### API Service
```javascript
import { postsAPI } from './services/api'

// Create post
await postsAPI.create({ text: 'My post', visibility: 'public' })

// Like post
await postsAPI.like(postId)
```

## Styling

The app uses CSS variables for theming (see `index.css`):
- `--primary-color` - Primary brand color (#4CAF50)
- `--secondary-color` - Secondary color (#2196F3)
- `--danger-color` - Error/danger color (#f44336)
- `--background` - Page background
- `--card-background` - Card/component background
- `--text-primary` - Primary text color
- `--text-secondary` - Secondary text color

Responsive design with mobile breakpoints at 768px.

## WebSocket Protocol

Chat messages use JSON format:

**Outgoing (client → server):**
```json
{
  "type": "chat_message",
  "message": "Hello!"
}
```

**Incoming (server → client):**
```json
{
  "type": "chat_message",
  "message": {
    "author": "username",
    "text": "Hello!",
    "timestamp": "2025-11-17T12:00:00Z"
  }
}
```

## Troubleshooting

### CORS Issues
Ensure backend has CORS properly configured for the frontend origin.

### WebSocket Connection Fails
- Check backend WebSocket endpoint is running
- Verify JWT token is valid
- Check browser console for errors

### API 401 Errors
- Clear localStorage and login again
- Check token expiration settings match backend

## Next Steps

- Add tests (Jest + React Testing Library)
- Add Tailwind CSS for enhanced styling
- Implement notifications UI
- Add image upload functionality
- Add activity charts/visualizations
