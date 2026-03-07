import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
  All,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '@app/common';
import { JwtAuthGuard } from '@app/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // Auth endpoints - Public
  @Post('auth/register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: any) {
    return this.gatewayService.forwardToAuthService('POST', '/auth/register', body);
  }

  @Post('auth/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.gatewayService.forwardToAuthService('POST', '/auth/login', body);
  }

  @Get('auth/google')
  @Public()
  async googleAuth() {
    return this.gatewayService.forwardToAuthService('GET', '/auth/google');
  }

  @Get('auth/google/callback')
  @Public()
  async googleAuthCallback(@Req() req: Request) {
    return this.gatewayService.forwardToAuthService('GET', '/auth/google/callback');
  }

  @Post('auth/forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: any) {
    return this.gatewayService.forwardToAuthService('POST', '/auth/forgot-password', body);
  }

  @Post('auth/reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: any) {
    return this.gatewayService.forwardToAuthService('POST', '/auth/reset-password', body);
  }

  @Post('auth/refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: any) {
    return this.gatewayService.forwardToAuthService('POST', '/auth/refresh', body);
  }

  // RSA endpoints - Public
  @Get('rsa/public-key')
  @Public()
  async getPublicKey() {
    return this.gatewayService.forwardToAuthService('GET', '/rsa/public-key');
  }

  // Protected endpoints - Require authentication
  @Get('users/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.gatewayService.forwardWithAuth('GET', '/users/profile', token);
  }

  // Generic proxy for all other routes
  // This allows forwarding any request to the appropriate service
  @All('*')
  async proxy(@Req() req: Request, @Body() body: any, @Headers('authorization') authHeader?: string) {
    const path = req.url;
    const method = req.method;
    
    // Extract token if present
    const token = authHeader?.replace('Bearer ', '');

    // Route to appropriate service based on path
    if (path.startsWith('/auth') || path.startsWith('/rsa') || path.startsWith('/users')) {
      if (token) {
        return this.gatewayService.forwardWithAuth(method, path, token, body);
      }
      return this.gatewayService.forwardToAuthService(method, path, body);
    }

    // Health check should not be proxied
    if (path.startsWith('/health')) {
      return { message: 'Use /health endpoint directly' };
    }

    // Add more service routing here as services are added
    // if (path.startsWith('/bookings')) {
    //   return this.gatewayService.forwardToBookingService(method, path, body, token);
    // }

    throw new Error(`No service found for path: ${path}`);
  }
}
