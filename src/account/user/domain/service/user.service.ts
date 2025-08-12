import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestUserDto } from "../../presentation/dto/create-user.dto";
import { CreateResultUserDto, CreateUserDto } from "../dto/CreateUserDto";
import { PrismaService } from "src/common/db/prisma.service";
import { UserRepository } from "../../infra/user.repository";
import * as bcrypt from 'bcrypt';
import { SearchhLoginCodeRequestDto } from "../../presentation/dto/search-user.dto";
import { SearchLoginCodeDto } from "../dto/SearchUserDto";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userRepository: UserRepository
    ) { }

    //--CREATE--
    async create(createRequestUserDto: CreateRequestUserDto): Promise<CreateResultUserDto> {
        const { teamId, loginCode, password, name, email, phone, position } = createRequestUserDto;

        // bcrypt로 비밀번호 해싱
        const saltRounds = 10; // 해싱 강도 ( 10이 일반적으로 적절 )
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 트랜잭션 시작
        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createUserDto = new CreateUserDto();
            createUserDto.teamId = teamId;
            createUserDto.loginCode = loginCode;
            createUserDto.password = hashedPassword;
            createUserDto.name = name;
            createUserDto.email = email;
            createUserDto.phone = phone;
            createUserDto.position = position;

            await this.userRepository.createUser(createUserDto, tx);

            return true;
        })

        return new CreateResultUserDto({
            loginCode: loginCode,
            isSuccess: result
        })
    }
    //---READ---
    async findOne(id: number): Promise<object> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundException(`해당하는 유저가 없습니다. ID: ${id}`);
        }
        return user;
    }
    async findAll(page: number, limit: number): Promise<object[]> {
        const userList = await this.userRepository.getAllUser(page, limit);
        return userList;
    }
    async findListByTeamId(teamId: number): Promise<object[]> {
        const userList = await this.userRepository.getUserByTeamId(teamId);
        return userList;
    }
    async findLoginCode(earchhLoginCodeRequestDto: SearchhLoginCodeRequestDto): Promise<string | null> {
        const searchLoginCodeDto = new SearchLoginCodeDto();
        searchLoginCodeDto.name = earchhLoginCodeRequestDto.name;
        searchLoginCodeDto.email = earchhLoginCodeRequestDto.email;
        searchLoginCodeDto.phone = earchhLoginCodeRequestDto.phone;

        return this.userRepository.getLoginCode(searchLoginCodeDto);
    }
    //---UPDATE---
    async update(id: number, updateData: Partial<CreateUserDto>): Promise<boolean> {
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundException(`해당하는 유저가 없습니다. ID: ${id}`);
        }

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            await this.userRepository.updateUserById(id, updateData, tx);

            return true;
        });

        return result;
    }
    //---DELETE---
    async delete(id: number): Promise<boolean> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundException(`해당하는 유저가 없습니다. ID: ${id}`);
        }

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            await this.userRepository.deleteUserById(id, tx);
            return true;
        });

        return result;
    }
}