import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly authServiceClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    const authServiceUrl = this.configService.get<string>('services.auth.url');
    
    this.authServiceClient = axios.create({
      baseURL: authServiceUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.authServiceClient.interceptors.request.use(
      (config) => {
        this.logger.log(`Forwarding request to ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.authServiceClient.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error(
          `Service error: ${error.response?.status} - ${error.response?.statusText}`,
        );
        return Promise.reject(error);
      },
    );
  }

  async forwardToAuthService(
    method: string,
    path: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: path,
        headers: {
          ...headers,
        },
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = data;
      }

      const response = await this.authServiceClient.request(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Service returned an error response
        throw new HttpException(
          error.response.data || error.message,
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new HttpException(
          'Service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        // Error setting up the request
        throw new HttpException(
          error.message || 'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // Helper method to forward requests with authentication
  async forwardWithAuth(
    method: string,
    path: string,
    authToken: string,
    data?: any,
  ): Promise<any> {
    return this.forwardToAuthService(method, path, data, {
      Authorization: `Bearer ${authToken}`,
    });
  }
}
