# API Gateway Service

API Gateway là entry point duy nhất cho tất cả các API requests từ clients. Gateway sẽ route requests đến các microservices tương ứng.

## Features

- ✅ Single entry point cho tất cả API calls
- ✅ Request routing đến các microservices
- ✅ Authentication middleware (JWT)
- ✅ Request/Response logging
- ✅ Error handling và transformation
- ✅ CORS configuration
- ✅ Health check endpoint

## Architecture

```
Client Request → API Gateway (Port 3000) → Microservices
                                    ├── Auth Service (Port 3001)
                                    ├── Booking Service (Future)
                                    └── Other Services (Future)
```

## API Endpoints

Tất cả endpoints được expose qua Gateway tại port 3000:

### Authentication (Public)
- `POST /auth/register` - Đăng ký user
- `POST /auth/login` - Đăng nhập
- `GET /auth/google` - Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Reset mật khẩu
- `POST /auth/refresh` - Refresh token

### RSA Keys (Public)
- `GET /rsa/public-key` - Lấy RSA public key

### Users (Protected - Requires JWT)
- `GET /users/profile` - Lấy thông tin profile

### Health Check
- `GET /health` - Kiểm tra health của gateway và các services

## Environment Variables

```env
GATEWAY_PORT=3000
AUTH_SERVICE_URL=http://auth-service:3001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build
npm run build

# Start production
npm run start:prod
```

## Docker

Gateway được containerized và có thể chạy qua Docker Compose:

```bash
cd ../../docker
docker-compose up -d api-gateway
```

## Adding New Services

Để thêm routing cho service mới:

1. Thêm service URL vào `src/config/configuration.ts`:
```typescript
services: {
  auth: { url: '...' },
  newService: { url: '...' }, // Add here
}
```

2. Thêm method vào `GatewayService`:
```typescript
async forwardToNewService(method: string, path: string, data?: any, headers?: Record<string, string>) {
  // Implementation
}
```

3. Thêm routes vào `GatewayController`:
```typescript
@Get('new-service/*')
async newServiceRoute(@Req() req: Request) {
  return this.gatewayService.forwardToNewService(...);
}
```

## Notes

- Gateway sử dụng HTTP để communicate với các services
- JWT tokens được validate tại Gateway trước khi forward
- Tất cả requests đều được logged
- Error responses từ services được properly transformed
