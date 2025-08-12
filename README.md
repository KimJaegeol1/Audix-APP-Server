# Audix APP Server

> 스마트 팩토리를 위한 AI 기반 장비 이상음 감지 백엔드 서버

## ✨ 주요 기능

- **🤖 AI 연동**: ML Server로부터 실시간 이상음 분석 결과 수신
- **📱 실시간 알림**: WebSocket을 통한 모바일 앱 즉시 알림
- **🏭 장비 관리**: 구역별 장비 상태 모니터링 및 관리
- **👥 사용자 관리**: 팀별 권한 관리 및 알림 설정

## 🏗️ 기술 스택

- **Framework**: NestJS 11 (Node.js 22, TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (PubSub, WebSocket)
- **Real-time**: Socket.IO
- **Container**: Docker

##  빠른 시작

### 1. 설치 및 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 데이터베이스 및 Redis 설정 수정

# 데이터베이스 초기화
npx prisma generate
npx prisma db push
```

### 2. 개발 서버 실행

```bash
npm run start:dev
```

### 3. Docker로 실행

```bash
# 네트워크 생성
docker network create app-network

# Redis 실행
docker run -d --name redis --network app-network -p 6379:6379 redis

# 앱 서버 빌드 및 실행
docker build -t audix-app-server .
docker run -d --name app-server --network app-network -p 3000:3000 audix-app-server
```

## 📁 프로젝트 구조

```
src/
├── account/          # 사용자/회사/팀 관리
├── site/            # 구역/장비 관리
├── alarm/           # 실시간 알림 시스템
│   ├── redis-pubsub/   # Redis PubSub 서비스
│   ├── websocket/      # WebSocket Gateway
│   └── test/           # 테스트 API
├── auth/            # JWT 인증
├── common/          # 공통 모듈 (DB, 유틸)
└── main.ts
```

## � 시스템 흐름

1. **ML Server** → AI 분석 완료 → Redis PubSub 메시지 발행
2. **APP Server** → Redis 메시지 수신 → 데이터베이스 저장
3. **WebSocket** → 연결된 모바일 앱으로 실시간 알림 전송
4. **Mobile App** → 알림 수신 및 사용자에게 표시

## 🛠️ API 테스트

### 테스트 알림 발행
```bash
curl -X POST "http://localhost:3000/test/alert/1001?normalScore=0.3"
```

### WebSocket 연결 테스트
```javascript
const socket = io('http://localhost:3000');
socket.on('device-alert', (data) => console.log('알림:', data));
```

### 알림 히스토리 조회
```bash
curl http://localhost:3000/test/alerts
```

## � 환경 변수

```env
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/audix"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# 서버
PORT=3000
```

## 🤝 연동 프로젝트

- **ML Server**: AI 분석 서버 (Python FastAPI)
- **Mobile App**: React Native 앱
- **Redis Server**: 메시징 및 캐시 서버