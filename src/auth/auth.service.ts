import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from 'src/auth/dto/user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Auth } from "src/entity/auth.entity";
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository : Repository<Auth>,  
        private jwtService : JwtService,
        private configSevice : ConfigService,
    ){}

    //email, pw, name 찾기
    async findbyFeilds(options : FindOneOptions<UserDTO> ) : Promise<Auth | undefined>{
        return await this.authRepository.findOne(options);
    }
    
    //저장
    async save(userDTO : UserDTO) : Promise<UserDTO | undefined> {
        await this.transformPassword(userDTO);
        return await this.authRepository.save(userDTO);
    }

    //bcrypt 변환
    async transformPassword(user : UserDTO) : Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 10,
        )
        return Promise.resolve();
    }

    //user등록
    async registerUser(newUser : UserDTO) : Promise<UserDTO | undefined> {
        const userFind : UserDTO = await this.findbyFeilds({
            where : { email : newUser.email }
        })

        if(userFind){
            throw new HttpException("user is aready used", HttpStatus.BAD_REQUEST);
        }

        return await this.save(newUser);
    }

    //user login
    async login(userDTO : UserDTO) : Promise<{Token : string} | undefined> {
        const userFind : UserDTO = await this.findbyFeilds({
            where : { email : userDTO.email }
        })

        const comparePassword = await bcrypt.compare(userDTO.password, userFind.password);

        if(!userFind || !comparePassword){
            throw new UnauthorizedException('이메일과 비밀번호를 확인해 주세요.');
        }

        const payload1 = { email : userDTO.email, username : userDTO.username}; //sub은 토큰 제목

        return {
            Token : this.jwtService.sign(payload1),
        };
    }

    getCookieWithJwtAccessToken(email : string, username : string){
        const payload = { email, username };

        const Token = this.jwtService.sign(payload, {
            secret : this.configSevice.get<string>('JWT_ACCESS_TOKEN'),
            expiresIn : `${this.configSevice.get('JWT_ACCCESS_TOKEN_EXPIRATION_TIME')}s`
        })

        return {
            accessToken : Token,
            domain : `localhost`,
            path : '/',
            httpOnly : true,
            maxAge :
                Number(this.configSevice.get('JWT_ACCESS_TOKEN__EXPIRATION_TIME')) * 1000,
        }
    }

    getCookieWithJwtRefreshToken(email : string, username : string){
        const payload = { email, username };

        const Token = this.jwtService.sign(payload, {
            secret : this.configSevice.get('JWT_REFRESH_TOKEN'),
            expiresIn : `${this.configSevice.get('JWT_FRESH_TOKEN_EXPIRATION_TIME')}s`
        })

        return {
            
        }

    }
}          