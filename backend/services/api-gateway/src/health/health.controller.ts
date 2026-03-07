import { Controller, Get } from '@nestjs/common';
import { Public } from '@app/common';
import { GatewayService } from '../gateway/gateway.service';

@Controller('health')
export class HealthController {
  constructor(private gatewayService: GatewayService) {}

  @Get()
  @Public()
  async check() {
    try {
      // Check if auth service is reachable
      await this.gatewayService.forwardToAuthService('GET', '/health');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
        services: {
          auth: 'ok',
        },
      };
    } catch (error) {
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
        services: {
          auth: 'unavailable',
        },
        error: error.message,
      };
    }
  }
}
