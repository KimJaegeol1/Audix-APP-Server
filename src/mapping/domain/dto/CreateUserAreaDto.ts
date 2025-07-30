export class CreateUserAreaDto {
    userId: number;
    areaId: number;

    static to(dto: CreateUserAreaDto) {
        return {
            user_id: dto.userId,
            area_id: dto.areaId
        };
    }
}

export class CreateResultUserAreaDto {
    userId: number;
    areaId: number;
    isSuccess: boolean;

    constructor(init: { userId: number, areaId: number, isSuccess: boolean }) {
        this.userId = init.userId;
        this.areaId = init.areaId;
        this.isSuccess = init.isSuccess;
    }
}