# AI 환경 소리 인식 경고 시스템

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22-green.svg" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/NestJS-v11-red.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-v5.7-blue.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/PostgreSQL-latest-blue.svg" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-latest-red.svg" alt="Redis" />
  <img src="https://img.shields.io/badge/Prisma-v6.12-darkgreen.svg" alt="Prisma Version" />
</p>

## 📋 프로젝트 개요

자동차 공장에서 발생하는 기계 소리를 AI가 실시간으로 분석하여 이상음 여부를 판단하고 고장 가능성을 조기 탐지하는 시스템입니다.

### 🎯 목표
도심, 공장 등 특정 환경에서 소리(경적, 비명, 기계 이상음 등)를 인식해 이상 발생 시 경고하는 AI 환경 소리 인식 경고 시스템

### ✨ 주요 기능

- **🔊 실시간 소리 인식**: AI 기반 소리 분류 및 이상음 탐지
- **📊 웹 대시보드**: 구역 및 기기별 소음 통계와 이상 패턴 시각화
- **📱 모바일 알림**: '점검 요망' 및 '위험 알림' 실시간 경고
- **🚨 긴급 상황 대응**: 산업재해 등 긴급 상황 시 소리 기반 위험 알림
- **📈 데이터 분석**: 대량 데이터 집계 및 시각화
- **🔧 확장성**: 공장 추가, 디바이스 추가 등 스케일 확장 지원

### 🏭 적용 분야
- **스마트시티**: 도심 환경 소음 모니터링
- **산업안전**: 공장 기계 이상음 탐지 및 안전 관리

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
- Docker (선택사항)

### 로컬 환경 설정

1. **저장소 클론**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 및 Redis 설정
```

4. **데이터베이스 설정**
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma db push
```

### 애플리케이션 실행

#### 개발 모드
```bash
# 일반 실행
npm run start

# Watch 모드 (자동 재시작)
npm run start:dev

# 디버그 모드
npm run start:debug
```

#### 프로덕션 모드
```bash
# 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

### Docker로 실행

```bash
# Docker 이미지 빌드
docker build -t ai-sound-detection .

# 컨테이너 실행
docker run -p 3000:3000 ai-sound-detection
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov

# Watch 모드 테스트
npm run test:watch
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
├── common/           # 공통 모듈
│   └── db/           # 데이터베이스 설정
└── main.ts           # 애플리케이션 진입점
```

### 모듈 구조
각 도메인 모듈은 다음과 같은 구조를 따릅니다:

```
domain-module/
├── presentation/     # 컨트롤러 계층
├── domain/          # 비즈니스 로직 계층
├── infra/           # 인프라 계층 (Repository)
└── module.ts        # 모듈 정의
```

## 🔧 개발 도구

### 코드 포맷팅
```bash
# Prettier를 사용한 코드 포맷팅
npm run format
```

### 린팅
```bash
# ESLint를 사용한 코드 린팅
npm run lint
```

## 📊 시스템 요구사항

- **실시간 데이터 수집**: 기계 소리, AI 분석 결과, 이상 감지 이벤트
- **데이터 저장**: 기기별 상태 및 알림 로그
- **통계 분석**: 웹에서 대량 데이터 집계 및 시각화
- **실시간 알림**: 앱을 통한 관리자 빠른 응답
- **확장성**: 공장 및 디바이스 추가를 위한 스케일 확장

## 🚀 배포

프로덕션 환경에 배포할 때는 다음 사항을 고려하세요:

1. **환경 변수**: 프로덕션용 데이터베이스 및 Redis 설정
2. **보안**: HTTPS 설정 및 인증/인가 구현
3. **모니터링**: 로그 수집 및 성능 모니터링 설정
4. **백업**: 데이터베이스 정기 백업 설정

## 🤝 기여하기

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 [라이선스 유형]에 따라 라이선스가 부여됩니다.

## 📞 연락처

프로젝트 관련 문의사항이 있으시면 [연락처 정보]로 연락해 주세요.

---

## 🔗 관련 링크

- [NestJS 공식 문서](https://nestjs.com/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Redis 공식 문서](https://redis.io/documentation/)