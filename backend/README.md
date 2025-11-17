# Backend - Community Engagement Fitness Platform

Django + Django REST Framework + Channels backend with JWT authentication, Celery task queue, and Redis integration.

## Architecture

- **Framework**: Django 4.2+ with DRF 3.14+
- **Authentication**: JWT tokens via `djangorestframework-simplejwt`
- **Real-time**: Django Channels with Redis channel layer
- **Task Queue**: Celery with Redis broker
- **Database**: PostgreSQL
- **Cache/Queue**: Redis

## Apps

- `accounts` - User authentication and profile management
- `posts` - Social posts with likes and comments
- `activities` - Activity logging (steps, calories, etc.)
- `challenges` - Fitness challenges and leaderboards
- `groups` - User groups with chat functionality
- `notifications` - User notifications

## Setup

### Local Development (with venv)

1. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

### Docker Development

See `infra/` directory for Docker Compose setup.

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user profile

### Posts
- `GET /api/posts/` - List posts
- `POST /api/posts/` - Create post
- `POST /api/posts/{id}/like/` - Like a post

### Activities
- `GET /api/activities/` - List activities
- `POST /api/activities/` - Log new activity

### Challenges
- `GET /api/challenges/` - List challenges
- `POST /api/challenges/{id}/join/` - Join challenge
- `GET /api/challenges/{id}/leaderboard/` - Get leaderboard

### Groups
- `GET /api/groups/` - List groups
- `POST /api/groups/{id}/join/` - Join group
- `POST /api/groups/{id}/leave/` - Leave group

### Notifications
- `GET /api/notifications/` - List user notifications

## Testing

Run tests with pytest:
```bash
pytest
```

## Environment Variables

See `.env.example` for required environment variables.
