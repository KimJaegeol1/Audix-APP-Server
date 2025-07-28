export class CreateAreaDto {
    name: String;
    address: String;
    explain?: String;
    status?: String;

    static to(dto: CreateAreaDto) {
        return {
            name: dto.name,
            address: dto.address,
            explain: dto.explain ?? null,
            status: dto.status ?? null
        }
    }
}