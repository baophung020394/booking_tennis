import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { JwtPayload } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    // Verify token with auth service
    try {
      const authServiceUrl = this.configService.get<string>('services.auth.url');
      // For now, just validate the token structure
      // In production, you might want to verify with auth service
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
