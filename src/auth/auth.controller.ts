import { Controller, Post, Body } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('/register')
    async register(@Body() userDTO : UserDTO) : Promise<any> {
        return await this.authService.registerUser(userDTO);
    }

}
