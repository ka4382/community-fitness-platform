# Community Engagement Fitness Platform

Full-stack fitness social platform with activity tracking, challenges, groups, and real-time chat.

## 🏗️ Architecture

**Monorepo Structure:**
- `backend/` - Django + DRF + Channels + Celery
- `frontend/` - React 18 + Vite
- `infra/` - Docker Compose, NGINX
- `.github/workflows/` - CI/CD pipelines

**Tech Stack:**
- **Backend**: Django 4.2, Django REST Framework, Channels, Celery, Redis
- **Frontend**: React 18, Vite, React Router, Axios
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis 7
- **Real-time**: WebSockets via Django Channels
- **Auth**: JWT (djangorestframework-simplejwt)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone and navigate:**
   ```bash
   cd "Community Engagement Fitness Platform"
   ```

2. **Start all services:**
   ```bash
   cd infra
   docker-compose up --build
   ```

3. **Run migrations and create superuser:**
   ```bash
   docker-compose exec backend python manage.py migrate
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin: http://localhost:8000/admin/

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Run PostgreSQL and Redis (or use Docker for these)
# Update .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server with WebSocket support (ASGI)
pip install daphne
```
daphne -b 127.0.0.1 -p 8000 config.asgi:application

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be at http://localhost:3000 with API proxy to backend.

## 📚 Features

### ✅ Implemented
- **Authentication**: JWT-based login/register with token refresh
- **Social Posts**: Create posts, like, delete (author-only), with inline comments
- **Comments System**: Add, view, and manage comments on posts with expand/collapse UI
- **User Profiles**: View profiles, edit profile, avatar support, user statistics (posts, followers, following, activities)
- **Follow System**: Follow/unfollow users, view followers/following lists, real-time count updates
- **Activities**: Log fitness activities (steps, distance, calories) with tracking
- **Challenges**: Join fitness challenges, view leaderboards
- **Groups**: Create/join groups with **real-time WebSocket chat** (fully implemented)
- **Real-time Chat**: WebSocket-powered group chat with message history, live updates, and authentication
- **Notifications**: User notification system with database storage
- **Dark Mode**: Toggle between light and dark themes with localStorage persistence
- **Responsive UI**: Mobile-friendly design with smooth transitions and animations
- **Professional Branding**: Custom favicon with gradient design, PWA manifest, SEO meta tags

### 🔄 Ready for Implementation (Advanced Features)
- Presigned S3/Cloudinary uploads for media
- Celery tasks for automated badges and email notifications
- Redis-powered leaderboards for challenges
- Activity charts and analytics with Chart.js
- Global search functionality (users, posts, groups)
- Infinite scroll pagination for feeds
- Real-time WebSocket notifications for likes, comments, follows

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (returns access + refresh tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile
- `PATCH /api/auth/profile/update/` - Update user profile
- `GET /api/auth/profile/<username>/` - Get user profile by username
- `POST /api/auth/follow/<username>/` - Follow a user
- `POST /api/auth/unfollow/<username>/` - Unfollow a user
- `GET /api/auth/followers/<username>/` - Get user's followers
- `GET /api/auth/following/<username>/` - Get users that user is following
- `GET /api/auth/check-following/<username>/` - Check if following a user

### Posts
- `GET /api/posts/` - List posts (paginated)
- `POST /api/posts/` - Create post
- `GET /api/posts/{id}/` - Get post detail
- `POST /api/posts/{id}/like/` - Like a post
- `DELETE /api/posts/{id}/` - Delete post (author only)
- `GET /api/posts/{id}/comments/` - Get post comments
- `POST /api/posts/{id}/comments/` - Add comment to post

### Comments
- `GET /api/posts/comments/` - List all comments
- `POST /api/posts/comments/` - Create a comment
- `GET /api/posts/comments/{id}/` - Get comment detail
- `PATCH /api/posts/comments/{id}/` - Update comment (author only)
- `DELETE /api/posts/comments/{id}/` - Delete comment (author only)

### Activities
- `GET /api/activities/` - List activities
- `POST /api/activities/` - Log activity
- `GET /api/activities/{id}/` - Get activity detail

### Challenges
- `GET /api/challenges/` - List challenges
- `GET /api/challenges/{id}/` - Get challenge detail
- `POST /api/challenges/{id}/join/` - Join challenge
- `GET /api/challenges/{id}/leaderboard/` - Get leaderboard

### Groups
- `GET /api/groups/` - List groups
- `POST /api/groups/` - Create group (name, description, is_private)
- `GET /api/groups/{id}/` - Get group detail with member count
- `POST /api/groups/{id}/join/` - Join group (adds user to members)
- `POST /api/groups/{id}/leave/` - Leave group (removes user from members)

### Notifications
- `GET /api/notifications/` - List user notifications
- `PATCH /api/notifications/{id}/` - Mark as read

### WebSocket (Real-time)
- `ws://localhost:8000/ws/groups/{groupId}/?token={JWT}` - Group chat (live messaging)
  - **Authentication**: JWT token in query parameter
  - **Authorization**: Only group members can connect
  - **Features**: Real-time message broadcasting, message history, sender details
  - **Message Format**: `{"type": "chat_message", "message": "text"}`
  - **Response Format**: `{"type": "chat_message", "message": {"id", "text", "sender", "created_at"}}`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

### CI Pipeline
GitHub Actions runs automatically on push:
- Backend tests (Django/pytest)
- Frontend tests
- Linting
- Docker builds

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
POSTGRES_DB=fitnessdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1
```

### Frontend Configuration
Frontend uses Vite proxy (see `frontend/vite.config.js`):
- Development: Proxies `/api` to `http://localhost:8000`
- Production: Expects API at same origin

## 📁 Project Structure

```
├── backend/
│   ├── apps/
│   │   ├── accounts/      # User auth, profiles, follow system
│   │   ├── posts/         # Social posts and comments
│   │   ├── activities/    # Activity logging
│   │   ├── challenges/    # Fitness challenges
│   │   ├── groups/        # User groups
│   │   └── notifications/ # Notifications
│   ├── config/            # Django settings & config
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (PostCard, CommentSection, Header, Footer)
│   │   ├── pages/         # Route pages (Timeline, UserProfile, EditProfile, etc.)
│   │   ├── hooks/         # Custom hooks (useAuth, useGroupChat)
│   │   └── services/      # API client
│   ├── package.json
│   └── Dockerfile
├── infra/
│   ├── docker-compose.yml # Full stack setup
│   └── nginx/
│       └── nginx.conf     # Reverse proxy config
└── .github/
    └── workflows/
        └── ci.yml         # CI pipeline
```

## 🐳 Docker Services

The `docker-compose.yml` includes:
- **postgres** - PostgreSQL 15 database
- **redis** - Redis cache and message broker
- **backend** - Django API server (Daphne/ASGI)
- **celery_worker** - Background task worker
- **celery_beat** - Periodic task scheduler
- **frontend** - React app (production build)

## 🔌 WebSocket Architecture

### Real-time Group Chat Implementation

**Backend Components:**
1. **ASGI Configuration** (`config/asgi.py`):
   - Routes HTTP and WebSocket protocols
   - Uses `ProtocolTypeRouter` to separate HTTP/WS traffic
   - Integrates with Django Channels

2. **WebSocket Consumer** (`apps/groups/consumers.py`):
   - `GroupChatConsumer`: Handles WebSocket connections
   - JWT authentication on connection
   - Group membership verification
   - Real-time message broadcasting via Channel Layers
   - Message history retrieval from database

3. **Database Models**:
   - `Group`: Group information and members
   - `GroupMessage`: Chat messages with sender, text, timestamp

4. **Channel Layers**:
   - Development: In-memory channel layer
   - Production: Redis-backed channel layer for multi-process support

**Frontend Components:**
1. **WebSocket Hook** (`useGroupChat.js`):
   - Manages WebSocket connection lifecycle
   - Auto-reconnection handling
   - Message state management
   - Connection status tracking

2. **Chat UI** (`ChatRoom.jsx`):
   - Real-time message display
   - Connection status indicator
   - Auto-scroll to latest message
   - Message input with send functionality

**Message Flow:**
```
1. User sends message → Frontend WebSocket
2. Backend Consumer receives → Validates & saves to DB
3. Consumer broadcasts to group channel
4. All connected clients receive update
5. Frontend displays new message instantly
```

## 🔐 Authentication Flow

1. User registers via `/api/auth/register/`
2. User logs in via `/api/auth/login/` → receives `access` and `refresh` tokens
3. Frontend stores tokens in `localStorage`
4. All API requests include `Authorization: Bearer {access_token}`
5. On 401 response, frontend auto-refreshes token
6. If refresh fails, user is logged out

## 📱 Frontend Pages

- `/login` - Login page
- `/register` - Registration page
- `/` - Timeline feed (protected)
- `/create-post` - Create new post (protected)
- `/groups` - List all groups (protected)
- `/groups/:id` - Group detail with chat (protected)
- `/challenges` - List challenges (protected)
- `/activities` - Log activity (protected)
- `/profile/:username` - User profile page (protected)
- `/profile/edit` - Edit your profile (protected)

## 🎨 UI Features

- **Dark Mode**: Toggle between light and dark themes (persists across sessions)
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Interactive Components**: Collapsible comment sections, hover effects
- **Real-time Updates**: Comments update instantly, like counts increment
- **Profile Statistics**: View posts count, followers, following, steps, calories
- **Follow System**: Follow/unfollow with live count updates
- **Professional Favicon**: Custom SVG favicon with:
  - Gradient background (coral → turquoise → blue)
  - Dumbbell icon (fitness)
  - Heart symbol (community)
  - Activity pulse line (tracking)
  - PWA manifest for mobile home screen
  - SEO meta tags for social sharing

## 🛠️ Development Tips

### Backend
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server with WebSocket support (REQUIRED for chat)
daphne -b 127.0.0.1 -p 8000 config.asgi:application

# Alternative: Django dev server (NO WebSocket support)
python manage.py runserver
```

### Important Notes
- **For WebSocket chat to work**, you MUST run the server with Daphne (ASGI)
- Django's `runserver` does NOT support WebSockets
- Daphne is installed via `pip install daphne` (already in requirements.txt)

### Run Celery Locally
```bash
cd backend
celery -A config worker -l info
celery -A config beat -l info
```

### Access Django Shell
```bash
python manage.py shell
```

### Create Sample Data
You can create test data via Django admin or shell:
```bash
python manage.py shell
```

### View Logs (Docker)
```bash
docker-compose logs -f backend
docker-compose logs -f celery_worker
```

## 🎯 Key Features Walkthrough

### 1. **Posts with Comments**
- Create posts with optional media URLs
- Like posts (increments count)
- Delete your own posts
- Expand comment section to view/add comments
- Comments show author and timestamp

### 2. **User Profiles**
- Click any username to view their profile
- See user stats: posts, followers, following, fitness data
- Follow/unfollow users
- Edit your own profile (avatar, bio, name)

### 3. **Dark Mode**
- Click 🌙/☀️ button in header
- Preference saved automatically
- Smooth color transitions

### 4. **Groups & Real-time Chat**
- Create new groups (public/private)
- Join existing groups
- View group members count
- **Real-time WebSocket chat**:
  - Live message updates (no refresh needed)
  - Message history automatically loaded
  - Connection status indicator (🟢 Connected / 🔴 Disconnected)
  - Only group members can access chat
  - Secure JWT authentication
  - Message timestamps and sender information

### 5. **Social Feed**
- Timeline shows all posts
- Real-time updates for likes and comments
- Delete button (🗑️) appears only on your posts

## 🔧 Troubleshooting

### WebSocket Connection Issues

**Problem**: Chat shows "🔴 Disconnected" or "WebSocket connection error"

**Solutions**:
1. **Check server**: Ensure backend is running with Daphne, not Django dev server
   ```bash
   # Correct (supports WebSockets):
   daphne -b 127.0.0.1 -p 8000 config.asgi:application
   
   # Incorrect (no WebSocket support):
   python manage.py runserver
   ```

2. **Verify group membership**: You must join the group before accessing chat
   - Click "Join Group" button on group page
   - Refresh page after joining

3. **Check authentication**: Ensure you're logged in and have valid JWT token
   - Token is automatically included in WebSocket URL
   - Check browser console for authentication errors

4. **Port conflicts**: Make sure port 8000 is not blocked or in use

### Common Issues

**Posts not displaying media**:
- Media URLs must be valid HTTP/HTTPS URLs
- Base64 data URLs are not supported (use image hosting services)

**Dark mode not persisting**:
- Check browser localStorage is enabled
- Key stored: `darkMode` (boolean)

**Comments not expanding**:
- Ensure JavaScript is enabled
- Check browser console for errors

**Profile updates not saving**:
- Verify all required fields are filled
- Check network tab for API response errors
- Ensure JWT token is valid (not expired)

### Database Issues

**Missing migrations**:
```bash
python manage.py makemigrations
python manage.py migrate
```

**Reset database** (development only):
```bash
# Delete SQLite database
rm db.sqlite3

# Recreate migrations
python manage.py migrate
python manage.py createsuperuser
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a complete, production-ready fitness social platform with:
- ✅ Full authentication and authorization (JWT)
- ✅ Social features (posts, comments, likes, follow system)
- ✅ User profiles with statistics and editing
- ✅ Group management with real-time WebSocket chat
- ✅ **Real-time chat fully implemented** with message history
- ✅ Dark mode support with persistence
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ RESTful API with comprehensive endpoints
- ✅ WebSocket infrastructure with Channels and Daphne
- ✅ Custom branding (favicon, PWA manifest)
- ✅ Database models for users, posts, comments, groups, messages, activities

### Technology Stack Summary
**Backend**: Django 4.2, DRF, Channels, Daphne (ASGI), JWT Auth  
**Frontend**: React 18, Vite, React Router, Axios, WebSocket  
**Database**: SQLite (dev) / PostgreSQL (prod)  
**Real-time**: Django Channels + WebSocket  
**Cache**: Redis (for Channel Layers in production)  

### Features Status
| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Complete | JWT with refresh tokens |
| Posts & Comments | ✅ Complete | CRUD with author permissions |
| User Profiles | ✅ Complete | View, edit, statistics |
| Follow System | ✅ Complete | Follow/unfollow, lists, counts |
| Groups | ✅ Complete | Create, join, leave |
| Real-time Chat | ✅ Complete | WebSocket with message history |
| Dark Mode | ✅ Complete | Toggle with persistence |
| Activities Logging | ✅ Basic | Needs charts/analytics |
| Challenges | ✅ Basic | Needs progress tracking |
| Notifications | ✅ Database | Needs real-time delivery |
| Search | ❌ Pending | Global search feature |
| Analytics | ❌ Pending | Activity charts with Chart.js |

### Next Steps for Production:
1. **Deploy to cloud** (AWS/GCP/Azure)
   - Use AWS EC2 or Google Cloud Run for backend
   - Deploy frontend to Vercel, Netlify, or AWS S3 + CloudFront
   
2. **Set up PostgreSQL and Redis in production**
   - AWS RDS for PostgreSQL
   - AWS ElastiCache or Redis Cloud for Redis
   - Update environment variables with production credentials
   
3. **Configure S3/Cloudinary for media uploads**
   - Set up S3 bucket with proper CORS and IAM policies
   - Integrate presigned URLs for secure uploads
   - Update serializers to handle cloud storage URLs
   
4. **Enhance WebSocket scalability**
   - Configure Redis Channel Layers for multi-server support
   - Use AWS Application Load Balancer with WebSocket support
   - Implement connection pooling and rate limiting
   
5. **Add comprehensive test coverage**
   - Backend: pytest with 80%+ coverage
   - Frontend: Jest + React Testing Library
   - E2E tests with Playwright or Cypress
   
6. **Set up monitoring and logging**
   - Sentry for error tracking
   - DataDog or CloudWatch for metrics
   - ELK stack for log aggregation
   
7. **Configure CI/CD for automated deployments**
   - GitHub Actions for automated testing
   - Docker builds on every push
   - Automated deployment to staging/production

## 📚 Additional Resources

### Backend Models Overview
- **User** (CustomUser): Authentication, profiles, bio, avatar
- **Post**: Social posts with text, media, likes, visibility
- **Comment**: Post comments with author and timestamp
- **Follow**: User relationships (follower/following)
- **Group**: Community groups with members
- **GroupMessage**: Real-time chat messages
- **Activity**: Fitness activity logging (steps, distance, calories)
- **Challenge**: Fitness challenges with participants
- **Notification**: User notifications

### API Response Examples

**Login Response**:
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe"
  }
}
```

**User Profile Response**:
```json
{
  "id": 3,
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "bio": "Fitness enthusiast",
  "avatar_url": "https://example.com/avatar.jpg",
  "followers_count": 42,
  "following_count": 38,
  "posts_count": 15
}
```

**WebSocket Message**:
```json
{
  "type": "chat_message",
  "message": {
    "id": 123,
    "text": "Hello everyone!",
    "sender": {
      "id": 3,
      "username": "john_doe",
      "full_name": "John Doe"
    },
    "created_at": "2025-11-17T22:30:00.000Z"
  }
}
```

### Environment Variables Reference

**Backend (.env)**:
```env
# Django Core
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True  # Set to False in production
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1  # Add production domain

# Database
POSTGRES_DB=fitnessdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres  # Change in production
POSTGRES_HOST=localhost  # RDS endpoint in production
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0  # ElastiCache in production
CELERY_BROKER_URL=redis://localhost:6379/1

# JWT Settings (optional, has defaults)
ACCESS_TOKEN_LIFETIME_DAYS=7
REFRESH_TOKEN_LIFETIME_DAYS=30

# CORS (for separate frontend domain)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Frontend (.env)**:
```env
# API Base URL
VITE_API_URL=http://localhost:8000  # Production API URL
VITE_WS_URL=ws://localhost:8000     # Production WS URL
```

### Security Best Practices

1. **JWT Tokens**:
   - Access tokens expire in 7 days (configurable)
   - Refresh tokens expire in 30 days
   - Tokens stored in localStorage (consider httpOnly cookies for production)

2. **WebSocket Security**:
   - JWT authentication required for connections
   - Group membership verified before allowing access
   - AllowedHostsOriginValidator prevents CSRF attacks

3. **API Security**:
   - CORS configured for specific origins
   - CSRF protection enabled
   - Authentication required for all protected endpoints
   - Author-only permissions for delete/edit operations

4. **Production Checklist**:
   - [ ] Change SECRET_KEY
   - [ ] Set DEBUG=False
   - [ ] Configure ALLOWED_HOSTS
   - [ ] Use HTTPS/WSS protocols
   - [ ] Enable rate limiting
   - [ ] Set up database backups
   - [ ] Configure environment variables properly
   - [ ] Use strong passwords for databases
   - [ ] Enable security headers (CSP, HSTS, etc.)
   - [ ] Set up monitoring and alerts

---

**Built with ❤️ for the fitness community**

