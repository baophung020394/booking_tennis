# Booking Tennis - Backend

Backend microservices architecture for Tennis Booking & Coaching Management System.

## Architecture

- **NestJS Microservices**: Using RabbitMQ for inter-service communication
- **PostgreSQL**: Primary database with Prisma ORM
- **Redis**: Caching and session management
- **RabbitMQ**: Message queue for microservices
- **Docker**: Containerized services for easy deployment

## Services

### API Gateway (`services/api-gateway`)

Single entry point for all API requests:
- Routes requests to appropriate microservices
- JWT authentication middleware
- Request/response logging
- Error handling and transformation
- CORS configuration

### Auth Service (`services/auth-service`)

Authentication and authorization microservice with:
- User registration and login
- Google OAuth integration
- Password reset (forgot password)
- JWT token management (access + refresh tokens)
- RSA encryption for sensitive data
- Role-based access control (RBAC)

## Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

## 📖 Documentation

- **[GUIDE.md](./GUIDE.md)** - Hướng dẫn chi tiết chạy local, Docker và test API đầy đủ
- **[SETUP.md](./SETUP.md)** - Hướng dẫn setup ban đầu

## Quick Start

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy environment example files
cp docker/.env.example docker/.env
cp services/auth-service/.env.example services/auth-service/.env

# Edit the .env files with your configuration
```

### 3. Start Infrastructure (PostgreSQL, Redis, RabbitMQ)

```bash
cd docker
docker-compose up -d
```

### 4. Setup Database

```bash
cd services/auth-service

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

### 5. Start Services

#### Start API Gateway (Recommended - All requests go through Gateway)

```bash
cd services/api-gateway
npm run start:dev
```

The gateway will be available at `http://localhost:3000`

#### Or Start Auth Service Directly

```bash
cd services/auth-service
npm run start:dev
```

The service will be available at `http://localhost:3001`

## API Endpoints

**Note:** All endpoints should be accessed through API Gateway at `http://localhost:3000`

### Authentication (via Gateway)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/refresh` - Refresh access token

### RSA Keys (via Gateway)

- `GET /rsa/public-key` - Get RSA public key for encryption

### Users (via Gateway - Protected)

- `GET /users/profile` - Get user profile (requires JWT token)

### Health Check

- `GET /health` - Gateway health check (checks all services)

## Docker Deployment

### Build and Run All Services

```bash
cd docker
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f auth-service
```

### Stop Services

```bash
docker-compose down
```

### Expose Public IP

To expose services to public IP, update `docker-compose.yml`:

1. Change port mappings from `3001:3001` to `0.0.0.0:3001:3001`
2. Or use environment variable: `AUTH_SERVICE_PORT=0.0.0.0:3001:3001`

## Development

### Project Structure

```
backend/
├── libs/
│   ├── common/          # Shared utilities, DTOs, guards
│   ├── database/        # Prisma service
│   └── messaging/      # RabbitMQ configuration
├── services/
│   └── auth-service/    # Authentication microservice
└── docker/              # Docker compose configuration
```

### Using NestJS CLI

All controllers, services, and modules are created using NestJS CLI:

```bash
# Generate a new module
nest generate module module-name

# Generate a new controller
nest generate controller controller-name

# Generate a new service
nest generate service service-name
```

## Environment Variables

See `.env.example` files in each service directory for required environment variables.

## Database Schema

The database schema is defined in Prisma schema files:
- `services/auth-service/prisma/schema.prisma`

Run migrations to update the database:
```bash
npm run prisma:migrate
```

## RSA Encryption

The Auth service includes RSA encryption for sensitive data:
- Keys are automatically generated on first run
- Public key is available via `/rsa/public-key` endpoint
- Private key is stored securely and never exposed

## Security Notes

⚠️ **IMPORTANT**: Before deploying to production:

1. Change all default secrets in `.env` files
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Enable HTTPS/TLS
5. Secure database credentials
6. Use environment-specific configurations

## License

MIT
