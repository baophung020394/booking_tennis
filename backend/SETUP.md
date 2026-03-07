# Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- npm >= 9.0.0

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

#### Docker Environment

```bash
cd docker
cp .env.example .env
# Edit .env with your configuration
```

#### Auth Service Environment

```bash
cd ../services/auth-service
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Infrastructure Services

Start PostgreSQL, Redis, and RabbitMQ:

```bash
cd ../../docker
docker-compose up -d postgres redis rabbitmq
```

Wait for services to be healthy (check with `docker-compose ps`).

### 4. Setup Database

```bash
cd ../services/auth-service

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data (roles, default organization)
npm run prisma:seed
```

### 5. Generate RSA Keys

RSA keys will be automatically generated on first service start. Alternatively, you can generate them manually:

```bash
mkdir -p keys
# Keys will be generated automatically when service starts
```

### 6. Start Services

#### Start API Gateway (Recommended)

```bash
cd ../api-gateway
npm run start:dev
```

Gateway sẽ chạy tại `http://localhost:3000` và route tất cả requests đến các services.

#### Or Start Auth Service Directly

```bash
cd ../auth-service
npm run start:dev
```

Service sẽ chạy tại `http://localhost:3001`

#### Production Mode (Docker)

```bash
cd ../../docker
docker-compose up -d api-gateway auth-service
```

### 7. Verify Setup

Check Gateway health endpoint (recommended):

```bash
curl http://localhost:3000/health
```

Or check Auth Service directly:

```bash
curl http://localhost:3001/health
```

Get RSA public key via Gateway:

```bash
curl http://localhost:3000/rsa/public-key
```

## Testing Authentication

**Note:** Tất cả requests nên đi qua API Gateway tại port 3000

### Register a User (via Gateway)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "roleId": "<role-id-from-database>"
  }'
```

### Login (via Gateway)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Forgot Password (via Gateway)

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Get User Profile (via Gateway - Requires JWT)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-access-token>"
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in .env file
- Ensure database exists: `docker-compose exec postgres psql -U postgres -c "\l"`

### RabbitMQ Connection Issues

- Check RabbitMQ management UI: http://localhost:15672
- Default credentials: guest/guest
- Verify RABBITMQ_URL in .env

### RSA Key Issues

- Ensure keys directory exists: `mkdir -p keys`
- Check file permissions
- Keys are generated automatically on first run

### Port Conflicts

If ports are already in use, update them in:
- `docker/.env` for Docker services
- `services/auth-service/.env` for service port

## Next Steps

- Configure Google OAuth credentials
- Setup email service (SMTP)
- Configure production secrets
- Setup SSL/TLS certificates
