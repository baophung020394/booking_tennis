import { Controller, Get } from '@nestjs/common';
import { Public } from '@app/common';
import { PrismaService } from '@app/database';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Public()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'auth-service',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'auth-service',
        error: error.message,
      };
    }
  }
}
