import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from 'src/entity/auth.entity'
import { hash, compare } from 'bcrypt'
import { UserDTO } from 'src/auth/dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('Auth')
        private authRepository : Repository<Auth>,
    ){}

    async setCurrentRefreshToken(refreshToken : string, email : string){

        const currentHashedRefreshToken = await hash(refreshToken, 10);
        await this.authRepository.update(email, {currentHashedRefreshToken});

    }

    async getUserRefreshTokenMatches(refreshToken : string, email : string){

        //const user = this.authRepository.findOne({ email });
        
        const RefreshTokenMatch = await compare(
            refreshToken, 
        )
    }
}
