import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), //요청으로 온 해도에서 토큰 추출 하는것//jwt 시크릿 키
            inject : [ConfigService],
            useFactory : (config : ConfigService) => ({
                secret : config.get<string>('JWT_SECRET'),
            ignoreExpriration : false //jwt 만료 기간 무시 하지 말라        
        })
    })
}
    //vaildate 인증 부분
    async vaildate(payload){}
}