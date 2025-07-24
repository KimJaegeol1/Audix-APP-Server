import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient
 } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor( configService: ConfigService ){
        super(
            {
                datasources: {
                    db: {
                        url: `${configService.get<string>('DATABASE_URL')}`
                    }
                },
                transactionOptions: {
                    timeout: 3000
                }
            }
        )
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}