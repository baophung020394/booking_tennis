import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
