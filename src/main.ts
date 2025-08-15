import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/'  // /images/ 경로로 직접 접근 가능하도록 설정
  });

  console.log('📁 Static assets path:', join(__dirname, '..', 'public'));
  console.log('🌐 Static files served at: http://localhost:3000/');

  // CORS 설정 추가
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  const port = process.env.PORT ?? 3000;

  // 모든 인터페이스에서 접속 허용 (0.0.0.0)
  await app.listen(port, '0.0.0.0');
}
bootstrap();
