import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from 'src/auth/dto/user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Auth } from "src/entity/auth.entiy";
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { stringify } from 'querystring';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository : Repository<Auth>,  
        private jwtService : JwtService,
        private mailerService : MailerService,
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

        const payload = { email : userDTO.email, username : userDTO.nickname}; //sub은 토큰 제목

        return {
            Token : this.jwtService.sign(payload),
        };
    }

    async EmailReceive(userDTO : {email: string}): Promise<void> {
        console.log('2',userDTO.email);
            //const number : number = generateRandom(111111, 999999)
        await this.mailerService.sendMail({
            to : "jswa7308@naver.com",
            from : 'sunggil0125@naver.com',
            subject : 'test',
            text : '성공해부렸다.'
        });
    }
}          