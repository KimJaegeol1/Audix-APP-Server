FROM node:22

# 작업 디렉토리 설정
WORKDIR /var/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (npm ci 대신 npm install 사용)
RUN npm install

# .env 파일과 Prisma 스키마 복사
COPY .env ./
COPY prisma ./prisma/

# Prisma 클라이언트 생성
RUN npx prisma generate

# 나머지 소스 코드 복사
COPY . ./

# 애플리케이션 빌드
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]