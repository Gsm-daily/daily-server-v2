import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthService } from './auth.service';
import { Auth } from 'src/entity/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports : [
    TypeOrmModule.forFeature([Auth]),
    PassportModule.register({
        defaultStrategy: 'jwt',
        session: false,
      }),
    // JwtModule.registerAsync({
    //     imports:[ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (config: ConfigService) => ({
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: { expiresIn: '7d' },
    //     }),
    //   }),
    JwtModule.register({
        secret : 'sunggil',
        signOptions : { expiresIn : '7d'}
    })
],
  exports : [TypeOrmModule],
  controllers: [AuthController],
  providers : [AuthService]
})
export class AuthModule {}
