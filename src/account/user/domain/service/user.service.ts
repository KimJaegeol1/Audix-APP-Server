import { Injectable } from "@nestjs/common";
import { CreateRequestUserDto } from "../../presentation/dto/create-user.dto";
import { CreateResultUserDto, CreateUserDto } from "../dto/CreateUserDto";
import { PrismaService } from "src/common/db/prisma.service";
import { UserRepository } from "../../infra/user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userRepository: UserRepository
    ) { }

    async create(createRequestUserDto: CreateRequestUserDto): Promise<CreateResultUserDto> {
        const { teamId, loginCode, password, name, email, phone, position, isActive, refreshToken } = createRequestUserDto;
        // 제약조건 검사해야함

        // 트랜잭션 시작
        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createUserDto = new CreateUserDto();
            createUserDto.teamId = teamId;
            createUserDto.loginCode = loginCode;
            createUserDto.password = password;
            createUserDto.name = name;
            createUserDto.email = email;
            createUserDto.phone = phone;
            createUserDto.position = position;
            createUserDto.isActive = isActive;
            createUserDto.refreshToken = refreshToken;

            await this.userRepository.createUser(createUserDto, tx);

            return true;
        })

        return new CreateResultUserDto({
            loginCode: loginCode,
            isSuccess: result
        })
    }
}