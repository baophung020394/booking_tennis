import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { GatewayService } from '../gateway/gateway.service';

@Module({
  controllers: [HealthController],
  providers: [GatewayService],
})
export class HealthModule {}
