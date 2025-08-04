import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/'  // /images/ 경로로 직접 접근 가능하도록 설정
  })

  console.log('📁 Static assets path:', join(__dirname, '..', 'public'));
  console.log('🌐 Static files served at: http://localhost:3000/');

  // CORS 설정 추가
  app.enableCors({
    origin: true, // 모든 origin 허용 (개발용)
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
