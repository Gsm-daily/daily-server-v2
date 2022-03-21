import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { FindOneOptions } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { User } from 'src/entity/user.entiy'
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    
    constructor(
    @InjectRepository(AuthRepository)
    private authRepository : AuthRepository){}

    async findbyFeilds(options : FindOneOptions<UserDTO> ) : Promise<User | undefined>{
        return await this.authRepository.findOne(options);
    }
    
    async save(userDTO : UserDTO) : Promise<UserDTO | undefined> {
        await this.transformPassword(userDTO);
        return await this.authRepository.save(userDTO);
    }

    async transformPassword(user : UserDTO) : Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 10,
        )
        return Promise.resolve();
    }

    async registerUser(newUser : UserDTO) : Promise<UserDTO | undefined> {
        const userFind : UserDTO = await this.findbyFeilds({
            where : { email : newUser.email }
        })

        if(userFind){
            throw new HttpException("user is aready used", HttpStatus.BAD_REQUEST);
        }

        return await this.save(newUser);
    }

    async login(userDTO : UserDTO) : Promise<UserDTO | undefined> {
        const userFind : UserDTO = await this.findbyFeilds({
            where : { email : userDTO.email }
        })

        const comparePassword = await bcrypt.compare(userDTO.password, userFind.password);
        if(!userFind || !comparePassword){
            throw new UnauthorizedException();
        }

        return 
    }
}         
