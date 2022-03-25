import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "kimsunggil2005!",
      database: "daily",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: false
      })
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
