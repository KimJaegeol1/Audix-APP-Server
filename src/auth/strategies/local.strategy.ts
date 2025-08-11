import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../service/auth.service";

// LocalStrategy - 로그인 시 실행되는 코드
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'loginCode',
            passwordField: 'password'
        })
    }

    async validate(loginCode: string, password: string): Promise<any> {
        console.log('🔍 LocalStrategy.validate() 실행');
        console.log('  - 입력된 loginCode:', loginCode);
        console.log('  - 입력된 password:', password ? '***masked***' : 'empty');

        const user = await this.authService.validateUser(loginCode, password)

        if (!user) {
            console.log('  - 인증 실패: 사용자 정보가 유효하지 않습니다.');
            throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
        }

        console.log('✅ 인증 성공: 사용자 정보를 req.user에 저장');
        console.log('  - User ID:', user.id);
        console.log('  - User Name:', user.name);

        return user; // 이 값이 req.user가 됨

    }
}

