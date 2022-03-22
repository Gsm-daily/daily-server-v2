import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([AuthRepository]),
    
],
  exports : [TypeOrmModule],
  controllers: [AuthController],
  providers : [AuthService]
})
export class AuthModule {}
