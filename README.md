# 레시피 원가 계산기 (Recipe Cost Calculator)

카페·음식점·도시락 사업자를 위한 웹 기반 레시피 원가 자동 계산 및 마진 시뮬레이션 도구

## 주요 기능

### 1. **재료 데이터베이스 관리**
- 재료명, 단가, 단위, 카테고리별 등록
- 공급처 정보 저장
- 재료 검색 및 필터링

### 2. **레시피 정의 및 원가 자동 계산** ⭐ 킬러 기능
- 재료 선택 → 수량 입력 → 자동 원가 계산
- 재료별 원가 세부 표시
- 단위 자동 변환 (kg ↔ g, ml ↔ l)

### 3. **판매가 & 수익율 시뮬레이션** ⭐ 킬러 기능
- 판매가 입력 → 수익액/수익율/마진율 자동 계산
- 목표 수익율 설정 → 추천 판매가 역산
- 실시간 마진 분석

### 4. **통계 & 대시보드**
- 평균 원가, 평균 판매가, 평균 수익율
- 재료 사용 빈도 TOP 5
- 수익율 분포 시각화

### 5. **가격 변동 추적**
- 재료 단가 변경 시 자동 이력 기록
- 지난달 vs 이번달 비교
- 가격 변동이 수익율에 미치는 영향 분석

## 기술 스택

| 분야 | 기술 |
|------|------|
| **프레임워크** | Next.js 16 (App Router) |
| **언어** | TypeScript |
| **UI 라이브러리** | shadcn/ui + Tailwind CSS |
| **데이터베이스** | SQLite (로컬) |
| **ORM** | Drizzle ORM |
| **차트** | Recharts |
| **런타임** | Node.js |

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd recipe-cost-calculator
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

## 화면 구성 (7개)

| # | 화면명 | 경로 | 기능 |
|---|--------|------|------|
| 1 | **대시보드** | `/` | 통계 요약, 인기 재료 TOP 5 |
| 2 | **재료 목록** | `/ingredients` | 재료 검색, 필터, 카테고리 분류 |
| 3 | **재료 추가** | `/ingredients/new` | 새 재료 등록 폼 |
| 4 | **재료 상세/수정** | `/ingredients/[id]` | 재료 조회, 수정, 삭제 |
| 5 | **레시피 목록** | `/recipes` | 모든 레시피 조회, 카드 뷰 |
| 6 | **레시피 상세** | `/recipes/[id]` | 원가 계산, 마진 시뮬레이션 |
| 7 | **레시피 생성** | `/recipes/new` | 새 레시피 생성 폼 |

## API 엔드포인트

```
GET    /api/ingredients           → 모든 재료 조회
POST   /api/ingredients           → 새 재료 생성
GET    /api/ingredients/[id]      → 재료 상세 조회
PUT    /api/ingredients/[id]      → 재료 수정 (가격 변동 자동 기록)
DELETE /api/ingredients/[id]      → 재료 삭제

GET    /api/recipes               → 모든 레시피 조회
POST   /api/recipes               → 새 레시피 생성
GET    /api/recipes/[id]          → 레시피 상세 조회 (재료 포함)
PUT    /api/recipes/[id]          → 레시피 수정
DELETE /api/recipes/[id]          → 레시피 삭제
```

## 개발 안내

### 빌드 검증
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# ESLint 린트
npm run lint

# 프로덕션 빌드
npm run build
```

### 폴더 구조
```
app/                     # Next.js App Router 페이지
├── page.tsx             # 대시보드 (/ 경로)
├── ingredients/         # 재료 관리 화면들
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── recipes/             # 레시피 화면들
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
└── api/                 # API 라우트들

src/
├── db/                  # Drizzle ORM 스키마
│   ├── schema.ts        # 테이블 정의
│   └── client.ts        # DB 클라이언트
├── lib/
│   ├── repositories/    # Repository 패턴 (DB 접근 추상화)
│   │   ├── ingredient.repository.ts
│   │   └── recipe.repository.ts
│   └── utils/           # 유틸 함수
│       ├── calculations.ts  # 원가 계산, 수익율 계산
│       └── errors.ts        # 에러 처리

components/             # UI 컴포넌트 (향후 추가)
```

## 데이터 저장

- **로컬 SQLite 데이터베이스** (`recipe-cost-calculator.db`)
- 모든 데이터는 로컬 머신에 저장
- 클라우드 의존 없음 (프라이버시 우선)
- `.env.local`에서 DB 경로 설정 가능

## UI 특징

- ✅ **한국어 UI** (모든 텍스트)
- ✅ **반응형 디자인** (600px 이상)
- ✅ **빈 상태 처리** (Empty state)
- ✅ **로딩 상태** (Loading UI)
- ✅ **에러 처리** (Error messages)
- ✅ **접근성** (WCAG 2.2 AA)

## 라이선스

MIT License

## 기여

버그 리포트나 기능 제안은 이슈로 등록 부탁드립니다.
