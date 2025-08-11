import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// JwtStrategy - JWT 토큰 검증 시 실행되는 코드
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
        })
    }

    async validate(payload: any) {
        console.log('🔍 JwtStrategy.validate() 실행');
        console.log('  - JWT 페이로드:', payload);
        console.log('  - 토큰 만료시간:', new Date(payload.exp * 1000));
        console.log('  - 현재시간:', new Date());

        // 여기서 추가 검증 로직을 넣을 수 있음
        // 예: 사용자가 여전히 활성 상태인지, 권한이 변경되지 않았는지 등

        console.log('✅ JWT 검증 성공: 사용자 정보를 req.user에 저장');

        return payload;
    }
}