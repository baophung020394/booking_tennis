# Hướng Dẫn Chạy và Test API - Booking Tennis Backend

Hướng dẫn chi tiết để chạy và test hệ thống Booking Tennis Backend.

---

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Infrastructure Services](#cài-đặt-infrastructure-services)
   - [Option 1: Sử Dụng Docker](#option-1-sử-dụng-docker-recommended)
   - [Option 2: Cài Đặt Local](#option-2-cài-đặt-local-manual)
3. [Chạy Local (Development)](#chạy-local-development)
4. [Chạy Docker](#chạy-docker)
5. [Test API](#test-api)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Docker**: >= 20.10.0 (Recommended - để chạy PostgreSQL, Redis, RabbitMQ)
- **Docker Compose**: >= 2.0.0
- **PostgreSQL**: >= 15.0 (nếu chạy local không dùng Docker)
- **Redis**: >= 7.0 (nếu chạy local không dùng Docker)
- **RabbitMQ**: >= 3.12 (nếu chạy local không dùng Docker)

---

## 📦 Cài Đặt Infrastructure Services

### Option 1: Sử Dụng Docker (Recommended)

**Khuyến nghị:** Sử dụng Docker để chạy PostgreSQL, Redis và RabbitMQ vì đơn giản và không cần cài đặt thủ công.

Docker sẽ tự động cài đặt và chạy các services này khi bạn chạy `docker-compose up`.

### Option 2: Cài Đặt Local (Manual)

Nếu bạn muốn cài đặt các services trực tiếp trên máy:

#### PostgreSQL

**macOS:**
```bash
# Sử dụng Homebrew
brew install postgresql@15
brew services start postgresql@15

# Hoặc sử dụng Postgres.app
# Download từ: https://postgresapp.com/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database
sudo -u postgres psql
CREATE DATABASE booking_tennis;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE booking_tennis TO postgres;
\q
```

**Windows:**
- Download từ: https://www.postgresql.org/download/windows/
- Hoặc sử dụng PostgreSQL installer

#### Redis

**macOS:**
```bash
brew install redis
brew services start redis

# Test
redis-cli ping
# Should return: PONG
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test
redis-cli ping
```

**Windows:**
- Download từ: https://github.com/microsoftarchive/redis/releases
- Hoặc sử dụng WSL2 với Redis

#### RabbitMQ

**macOS:**
```bash
# Cài đặt Erlang trước (RabbitMQ yêu cầu)
brew install erlang

# Cài đặt RabbitMQ
brew install rabbitmq

# Start RabbitMQ
brew services start rabbitmq

# RabbitMQ sẽ chạy tại:
# - Server: amqp://localhost:5672
# - Management UI: http://localhost:15672
# - Default credentials: guest/guest

# Enable management plugin
rabbitmq-plugins enable rabbitmq_management
```

**Linux (Ubuntu/Debian):**
```bash
# Cài đặt Erlang
sudo apt update
sudo apt install erlang erlang-nox

# Thêm RabbitMQ repository
echo 'deb https://dl.bintray.com/rabbitmq/debian bionic main' | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list

# Thêm GPG key
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -

# Cài đặt RabbitMQ
sudo apt update
sudo apt install rabbitmq-server

# Start RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# Enable management plugin
sudo rabbitmq-plugins enable rabbitmq_management

# Tạo admin user (optional)
sudo rabbitmqctl add_user admin admin123
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

**Windows:**
1. Download và cài đặt Erlang: https://www.erlang.org/downloads
2. Download RabbitMQ: https://www.rabbitmq.com/download.html
3. Cài đặt RabbitMQ
4. Enable management plugin:
   ```bash
   rabbitmq-plugins enable rabbitmq_management
   ```
5. Start RabbitMQ service từ Windows Services

**Kiểm Tra RabbitMQ:**

```bash
# Check status
rabbitmqctl status

# Access Management UI
# Mở browser: http://localhost:15672
# Login: guest/guest (default)
```

**Tạo User và Permissions (Optional):**

```bash
# Tạo user mới
rabbitmqctl add_user myuser mypassword

# Set permissions
rabbitmqctl set_permissions -p / myuser ".*" ".*" ".*"

# Set user tags (administrator, monitoring, management)
rabbitmqctl set_user_tags myuser administrator
```

---

### So Sánh: Docker vs Local Installation

| Aspect | Docker (Recommended) | Local Installation |
|--------|---------------------|-------------------|
| **Setup Time** | ~5 phút | ~30-60 phút |
| **Complexity** | Đơn giản | Phức tạp hơn |
| **Isolation** | Tốt (isolated containers) | Chia sẻ với hệ thống |
| **Port Conflicts** | Ít xảy ra | Có thể xảy ra |
| **Updates** | Dễ dàng (pull image mới) | Cần update từng service |
| **Resource Usage** | Cao hơn một chút | Thấp hơn |

**Khuyến nghị:** Sử dụng Docker cho development và production.

---

## 🚀 Chạy Local (Development)

### Bước 1: Clone và Install Dependencies

```bash
# Di chuyển vào thư mục backend
cd backend

# Install dependencies cho root và tất cả workspaces
npm install
```

### Bước 2: Setup Environment Variables

#### 2.1. Setup Docker Environment

```bash
cd docker
cp .env.example .env
```

Chỉnh sửa file `.env` nếu cần:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=booking_tennis
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# API Gateway
GATEWAY_PORT=3000

# Auth Service
AUTH_SERVICE_PORT=3001

# JWT Secrets (QUAN TRỌNG: Đổi trong production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### 2.2. Setup Auth Service Environment

```bash
cd ../services/auth-service
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Server
NODE_ENV=development
HTTP_PORT=3001

# Database (sử dụng Docker PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booking_tennis

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (phải khớp với docker/.env)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (tùy chọn)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Email (tùy chọn)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@booking-tennis.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### 2.3. Setup API Gateway Environment

```bash
cd ../api-gateway
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Gateway
GATEWAY_PORT=3000

# Services URLs
AUTH_SERVICE_URL=http://localhost:3001

# JWT (phải khớp với auth-service)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Bước 3: Start Infrastructure Services

#### Option A: Sử Dụng Docker (Recommended)

```bash
# Quay lại thư mục docker
cd ../../docker

# Start PostgreSQL, Redis, RabbitMQ
docker-compose up -d postgres redis rabbitmq

# Kiểm tra services đã chạy
docker-compose ps
```

Đợi vài giây để các services khởi động hoàn toàn. Kiểm tra logs nếu cần:

```bash
docker-compose logs postgres
docker-compose logs redis
docker-compose logs rabbitmq
```

**Kiểm tra RabbitMQ Management UI:**
- Mở browser: http://localhost:15672
- Login: `guest` / `guest` (default credentials)

#### Option B: Sử Dụng Local Services

Nếu bạn đã cài đặt PostgreSQL, Redis, RabbitMQ local:

1. **Start PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Start Redis:**
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis-server
   
   # Test
   redis-cli ping
   ```

3. **Start RabbitMQ:**
   ```bash
   # macOS
   brew services start rabbitmq
   
   # Linux
   sudo systemctl start rabbitmq-server
   
   # Enable management plugin (nếu chưa enable)
   rabbitmq-plugins enable rabbitmq_management
   
   # Check status
   rabbitmqctl status
   ```

4. **Kiểm tra RabbitMQ Management UI:**
   - Mở browser: http://localhost:15672
   - Login: `guest` / `guest`

5. **Cập nhật DATABASE_URL và RABBITMQ_URL trong `.env` files:**
   - `services/auth-service/.env`: Sử dụng `localhost` thay vì Docker service names
   - `services/api-gateway/.env`: Sử dụng `localhost` thay vì Docker service names

### Bước 4: Setup Database

```bash
cd ../services/auth-service

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database với dữ liệu mẫu (roles, default organization)
npm run prisma:seed
```

**Lưu ý:** Lấy `roleId` từ database để test register:

```bash
# Vào Prisma Studio để xem roles
npm run prisma:studio
```

Hoặc query trực tiếp:

```bash
# Vào PostgreSQL container
docker exec -it booking-tennis-postgres psql -U postgres -d booking_tennis

# Query roles
SELECT id, name FROM roles;
```

### Bước 5: Start Services

#### Terminal 1: Start Auth Service

```bash
cd services/auth-service
npm run start:dev
```

Auth Service sẽ chạy tại: `http://localhost:3001`

#### Terminal 2: Start API Gateway

```bash
cd services/api-gateway
npm run start:dev
```

API Gateway sẽ chạy tại: `http://localhost:3000`

### Bước 6: Verify Services

Mở browser hoặc dùng curl:

```bash
# Check Gateway health
curl http://localhost:3000/health

# Check Auth Service health
curl http://localhost:3001/health
```

---

## 🐳 Chạy Docker

### Cách 1: Chạy Tất Cả Services (Recommended)

```bash
cd docker

# Start tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
```

### Cách 2: Chạy Từng Service

```bash
cd docker

# Start infrastructure trước
docker-compose up -d postgres redis rabbitmq

# Đợi services healthy, sau đó start application services
docker-compose up -d auth-service api-gateway
```

### Kiểm Tra Services

```bash
# Xem trạng thái tất cả containers
docker-compose ps

# Kiểm tra health
curl http://localhost:3000/health
curl http://localhost:3001/health
```

### Stop Services

```bash
# Stop tất cả
docker-compose down

# Stop và xóa volumes (xóa data)
docker-compose down -v
```

### Rebuild Services

```bash
# Rebuild và restart
docker-compose up -d --build

# Rebuild service cụ thể
docker-compose up -d --build api-gateway
```

---

## 🧪 Test API

### Chuẩn Bị

1. **Lấy Role ID**: Cần `roleId` để register user. Query từ database:

```bash
# Vào PostgreSQL
docker exec -it booking-tennis-postgres psql -U postgres -d booking_tennis

# Query
SELECT id, name FROM roles;
```

Hoặc dùng Prisma Studio:

```bash
cd services/auth-service
npm run prisma:studio
# Mở http://localhost:5555
```

2. **Base URL**: Tất cả requests đi qua API Gateway tại `http://localhost:3000`

---

### 1. Health Check

```bash
# Gateway health (kiểm tra cả gateway và các services)
curl http://localhost:3000/health

# Auth Service health (trực tiếp)
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "api-gateway",
  "services": {
    "auth": "ok"
  }
}
```

---

### 2. RSA Public Key

```bash
curl http://localhost:3000/rsa/public-key
```

**Expected Response:**
```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
}
```

---

### 3. Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+84123456789",
    "roleId": "<role-id-from-database>"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "player"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Lưu lại `accessToken` và `refreshToken` để dùng cho các requests sau.**

---

### 4. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "player"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Get User Profile (Protected - Requires JWT)

```bash
# Thay <access-token> bằng token từ login/register
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <access-token>"
```

**Expected Response:**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "fullName": "Test User",
  "phone": "+84123456789",
  "role": {
    "id": "uuid",
    "name": "player",
    "description": "Casual player who can book courts"
  },
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Test với token không hợp lệ:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer invalid-token"
```

**Expected Response:** `401 Unauthorized`

---

### 6. Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh-token-from-login>"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 7. Forgot Password

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

**Lưu ý:** Email sẽ được gửi nếu đã cấu hình email service. Token reset sẽ được lưu trong database.

---

### 8. Reset Password

```bash
# Lấy token từ database hoặc email
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<reset-token-from-database-or-email>",
    "newPassword": "newpassword123"
  }'
```

**Expected Response:**
```json
{
  "message": "Password reset successfully"
}
```

**Lấy token từ database:**
```bash
# Vào PostgreSQL
docker exec -it booking-tennis-postgres psql -U postgres -d booking_tennis

# Query password reset tokens
SELECT token, "expiresAt", used FROM password_reset_tokens WHERE "userId" = '<user-id>';
```

---

### 9. Google OAuth (Tùy Chọn)

**Lưu ý:** Cần cấu hình Google OAuth credentials trước.

```bash
# Initiate Google OAuth
curl http://localhost:3000/auth/google

# Callback sẽ được handle tự động sau khi user authenticate với Google
```

---

## 📝 Test Scripts

Tạo file `test-api.sh` để test nhanh:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "1. Health Check"
curl -s $BASE_URL/health | jq

echo -e "\n2. Get RSA Public Key"
curl -s $BASE_URL/rsa/public-key | jq

echo -e "\n3. Register User"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "roleId": "<role-id>"
  }')
echo $REGISTER_RESPONSE | jq

# Extract token
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
echo -e "\nAccess Token: $ACCESS_TOKEN"

echo -e "\n4. Get Profile"
curl -s -X GET $BASE_URL/users/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo -e "\n5. Login"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo $LOGIN_RESPONSE | jq
```

Chạy script:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🔍 Troubleshooting

### 1. Database Connection Error

**Lỗi:** `Can't reach database server`

**Giải pháp:**
```bash
# Kiểm tra PostgreSQL đang chạy
docker-compose ps postgres

# Kiểm tra logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Kiểm tra DATABASE_URL trong .env
```

### 2. Port Already in Use

**Lỗi:** `EADDRINUSE: address already in use`

**Giải pháp:**
```bash
# Tìm process đang dùng port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>

# Hoặc đổi port trong .env
```

### 3. Prisma Client Not Generated

**Lỗi:** `Cannot find module '@prisma/client'`

**Giải pháp:**
```bash
cd services/auth-service
npm run prisma:generate
```

### 4. Migration Error

**Lỗi:** `Migration failed`

**Giải pháp:**
```bash
# Reset database (CẨN THẬN: Xóa tất cả data)
cd services/auth-service
npx prisma migrate reset

# Hoặc tạo migration mới
npx prisma migrate dev --name init
```

### 5. JWT Secret Mismatch

**Lỗi:** `Invalid token` hoặc `Token validation failed`

**Giải pháp:**
- Đảm bảo `JWT_SECRET` giống nhau trong:
  - `docker/.env`
  - `services/auth-service/.env`
  - `services/api-gateway/.env`

### 6. Service Not Reachable

**Lỗi:** `Service unavailable` hoặc `ECONNREFUSED`

**Giải pháp:**
```bash
# Kiểm tra service đang chạy
docker-compose ps

# Kiểm tra logs
docker-compose logs api-gateway
docker-compose logs auth-service

# Kiểm tra network
docker network ls
docker network inspect booking-tennis_booking-tennis-network
```

### 7. RabbitMQ Connection Error

**Lỗi:** `Connection refused` khi connect RabbitMQ

**Giải pháp:**

**Nếu dùng Docker:**
```bash
# Kiểm tra RabbitMQ container
docker-compose ps rabbitmq
docker-compose logs rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq

# Kiểm tra management UI
# Mở http://localhost:15672
# Login: guest/guest
```

**Nếu dùng Local Installation:**
```bash
# Kiểm tra RabbitMQ đang chạy
# macOS
brew services list | grep rabbitmq

# Linux
sudo systemctl status rabbitmq-server

# Start RabbitMQ nếu chưa chạy
# macOS
brew services start rabbitmq

# Linux
sudo systemctl start rabbitmq-server

# Kiểm tra port
lsof -i :5672  # RabbitMQ server port
lsof -i :15672 # Management UI port

# Kiểm tra Erlang đã cài đặt chưa
erl -version

# Test connection
rabbitmqctl status
```

**Kiểm tra RABBITMQ_URL trong .env:**
- Docker: `amqp://guest:guest@rabbitmq:5672` (trong container)
- Docker từ host: `amqp://guest:guest@localhost:5672`
- Local: `amqp://guest:guest@localhost:5672`

### 8. RSA Keys Not Generated

**Lỗi:** `Failed to load RSA keys`

**Giải pháp:**
```bash
# Tạo thư mục keys
cd services/auth-service
mkdir -p keys

# Keys sẽ tự động được generate khi service start lần đầu
# Hoặc restart service
npm run start:dev
```

---

## 📚 Tài Liệu Tham Khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ✅ Checklist

Trước khi deploy production, đảm bảo:

- [ ] Đổi tất cả default secrets trong `.env` files
- [ ] Cấu hình CORS đúng với frontend URL
- [ ] Setup SSL/TLS certificates
- [ ] Cấu hình email service
- [ ] Setup Google OAuth credentials
- [ ] Backup database strategy
- [ ] Monitoring và logging
- [ ] Rate limiting
- [ ] Security headers (Helmet)
- [ ] RabbitMQ users và permissions được cấu hình đúng
- [ ] RabbitMQ queues và exchanges được setup
- [ ] Database connection pooling được optimize

---

## 🔗 Quick Links

- **RabbitMQ Management UI**: http://localhost:15672 (guest/guest)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001

---

## 📚 Tài Liệu Tham Khảo Thêm

### RabbitMQ
- [RabbitMQ Official Docs](https://www.rabbitmq.com/documentation.html)
- [RabbitMQ Management Guide](https://www.rabbitmq.com/management.html)
- [RabbitMQ Best Practices](https://www.rabbitmq.com/best-practices.html)

### PostgreSQL
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

### Redis
- [Redis Official Docs](https://redis.io/docs/)
- [Redis Commands](https://redis.io/commands/)

---

**Happy Coding! 🚀**
