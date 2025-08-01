# Audix APP Server

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22-green.svg" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/NestJS-v11-red.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-v5.7-blue.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/PostgreSQL-latest-blue.svg" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-latest-red.svg" alt="Redis" />
  <img src="https://img.shields.io/badge/Prisma-v6.12-darkgreen.svg" alt="Prisma Version" />
  <img src="https://img.shields.io/badge/WebSocket-Socket.IO-orange.svg" alt="WebSocket" />
</p>

## 📋 프로젝트 개요

**Audix**는 산업용 장비의 이상음을 AI로 실시간 감지하여 모바일 앱으로 즉시 알림을 제공하는 **스마트 팩토리 솔루션**의 백엔드 서버입니다.

### 🎯 주요 역할
- **🔗 ML Server 연동**: AI 분석 결과를 Redis PubSub으로 수신
- **📱 실시간 알림**: WebSocket을 통한 모바일 앱 실시간 알림 전송
- **📊 데이터 관리**: 장비, 구역, 사용자 데이터 관리
- **🚨 알림 히스토리**: 이상 감지 알림 로그 저장 및 조회

### ✨ 핵심 기능

- **🔊 실시간 이상음 감지**: ML Server로부터 AI 분석 결과 수신
- **� WebSocket 통신**: 모바일 앱과 실시간 양방향 통신
- **� 알림 관리**: 장비별 이상 감지 알림 히스토리 관리
- **🏭 현장 관리**: 구역별 장비 상태 모니터링
- **👥 사용자 관리**: 팀별 권한 관리 및 알림 설정

## 🏗️ 시스템 아키텍처

### 마이크로서비스 구조
```
┌─────────────────┐    Redis PubSub    ┌─────────────────┐    WebSocket    ┌─────────────────┐
│   ML Server     │ ─────────────────▶ │   APP Server    │ ──────────────▶ │  Mobile App     │
│  (AI 분석)       │                    │  (백엔드 서버)    │                 │ (React Native)  │
└─────────────────┘                    └─────────────────┘                 └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │   PostgreSQL    │
                                        │   (데이터 저장)   │
                                        └─────────────────┘
```

### 기술 스택
- **Framework**: NestJS 11 (Node.js 22)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache & PubSub**: Redis
- **Real-time**: WebSocket (Socket.IO)
- **Language**: TypeScript
- **Container**: Docker

## 🔄 데이터 흐름

### 1. 이상음 감지 프로세스
```
1️⃣ ML Server: 장비 음성 분석 → normalScore ≤ 0.5 감지
2️⃣ Redis PubSub: 'device_alerts' 채널로 메시지 발행
3️⃣ APP Server: Redis 메시지 수신 → 데이터 저장
4️⃣ WebSocket: 연결된 모바일 앱으로 실시간 알림 전송
5️⃣ Mobile App: 알림 모달 표시
```

### 2. 메시지 포맷
```json
{
  "deviceId": 1001,
  "normalScore": 0.3,
  "timestamp": "2025-01-08T09:00:00.000Z"
}
```

## 🏗️ 시스템 아키텍처

### 기술 스택
- **Backend**: NestJS (Node.js 22)
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Language**: TypeScript
- **Container**: Docker

### 데이터베이스 구조

```
📊 스키마 구성
├── account (계정 관리)
│   ├── companys - 회사 정보
│   ├── users - 사용자 정보
│   └── teams - 팀 정보
├── site (현장 관리)
│   ├── areas - 구역 정보
│   └── devices - 디바이스 정보
└── mapping (관계 매핑)
    └── user_area - 사용자-구역 매핑
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 22+
- PostgreSQL
- Redis
- Docker (권장)

### 패키지 설치

```bash
npm install
```

**필수 패키지**:
- `@nestjs/websockets`: WebSocket 지원
- `@nestjs/platform-socket.io`: Socket.IO 플랫폼
- `@nestjs-modules/ioredis`: Redis 클라이언트
- `socket.io`: WebSocket 서버

### 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 및 Redis 설정
```

**필수 환경 변수**:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/audix"
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma db push
```

## 🐳 Docker 실행

### 네트워크 생성
```bash
docker network create app-network
```

### Redis 서버
```bash
# Redis 빌드 및 실행
docker build -f redis-server/Dockerfile . -t redis
docker run -d --name redis-server --network app-network -p 6379:6379 redis
```

### APP Server
```bash
# NestJS 빌드
docker build -t audix-app-server .

# 컨테이너 실행
docker run -d --name audix-app-server --network app-network -p 3000:3000 audix-app-server
```

### ML Server (연동용)
```bash
# ML Server 빌드 및 실행
docker build -t audix-ml-server ml-server/
docker run -d --name audix-ml-server --network app-network -p 8000:8000 audix-ml-server
```

## 📁 프로젝트 구조

```
src/
├── account/           # 계정 관리 모듈
│   └── user/         # 사용자 관리
├── site/             # 현장 관리 모듈
│   ├── area/         # 구역 관리
│   └── device/       # 디바이스 관리
├── mapping/          # 관계 매핑 모듈
├── alarm/            # 🆕 알림 관리 모듈
│   ├── redis-pubsub/ # Redis PubSub 서비스
│   └── test/         # 테스트 컨트롤러
├── common/           # 공통 모듈
│   └── db/           # 데이터베이스 설정
└── main.ts           # 애플리케이션 진입점
```

### 🚨 알림 모듈 상세

```
src/alarm/
├── redis-pubsub/
│   ├── redis-pubsub.service.ts    # Redis 구독 및 WebSocket 전송
│   ├── redis-pubsub.module.ts     # 모듈 설정
│   └── device-alert.gateway.ts    # WebSocket Gateway
└── test/
    └── test.controller.ts          # 테스트 API
```

## 🔧 API 엔드포인트

### 테스트 API
```bash
# 테스트 알림 발행
POST /test/alert/:deviceId?normalScore=0.3

# 알림 히스토리 조회
GET /test/alerts
```

### WebSocket 이벤트
```javascript
// 클라이언트 연결
const socket = io('http://localhost:3000');

// 실시간 알림 수신
socket.on('device-alert', (data) => {
  console.log('장비 알림:', data);
  // { deviceId: 1001, normalScore: 0.3 }
});
```

## 🧪 테스트

### 1. 서버 실행 상태 확인
```bash
curl http://localhost:3000
```

### 2. Redis PubSub 테스트
```bash
# 테스트 알림 발행
curl -X POST "http://localhost:3000/test/alert/1001?normalScore=0.3"
```

### 3. WebSocket 연결 테스트
```javascript
// 브라우저 콘솔에서 테스트
const socket = io('http://localhost:3000');
socket.on('connect', () => console.log('WebSocket 연결됨'));
socket.on('device-alert', (data) => console.log('알림 수신:', data));
```

### 4. 알림 히스토리 확인
```bash
curl http://localhost:3000/test/alerts
```

## 📊 데이터베이스 구조

### 스키마 구성
```
📊 Prisma 스키마
├── account (계정 관리)
│   ├── companys - 회사 정보
│   ├── users - 사용자 정보
│   └── teams - 팀 정보
├── site (현장 관리)
│   ├── areas - 구역 정보
│   └── devices - 디바이스 정보
└── mapping (관계 매핑)
    └── user_area - 사용자-구역 매핑
```

### Redis 데이터 구조
```
Redis Keys:
├── device:{deviceId} - 장비 상태 정보
│   ├── status: "abnormal" | "normal"
│   ├── lastAlertTime: ISO timestamp
│   └── normalScore: number
└── alert:{deviceId}:{timestamp} - 알림 로그 (7일 TTL)
    ├── deviceId: number
    ├── normalScore: number
    ├── timestamp: ISO timestamp
    └── type: "low_normal_score"
```

## 🚀 배포 및 운영

### 프로덕션 환경 체크리스트

- [ ] **환경 변수**: 프로덕션용 데이터베이스 및 Redis 설정
- [ ] **보안**: HTTPS 설정 및 CORS 정책 설정
- [ ] **모니터링**: 로그 수집 및 성능 모니터링 설정
- [ ] **백업**: 데이터베이스 정기 백업 설정
- [ ] **스케일링**: 로드 밸런서 및 클러스터링 고려

### 모니터링 포인트

```bash
# 서버 상태 확인
curl http://localhost:3000/health

# Redis 연결 상태
redis-cli ping

# WebSocket 연결 수 확인
curl http://localhost:3000/metrics
```

## 🔗 관련 프로젝트

- **ML Server**: AI 모델 서버 (Python FastAPI)
- **Mobile App**: React Native 앱
- **Redis Server**: PubSub 메시징 서버

## 📚 기술 문서

- [NestJS 공식 문서](https://nestjs.com/)
- [Socket.IO 공식 문서](https://socket.io/docs/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [Redis 공식 문서](https://redis.io/documentation/)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  <b>Audix APP Server</b> - Smart Factory Sound Monitoring Solution 🏭🔊
</p>