export default () => ({
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    },
    // Add more services here as they are created
    // booking: {
    //   url: process.env.BOOKING_SERVICE_URL || 'http://localhost:3002',
    // },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});
