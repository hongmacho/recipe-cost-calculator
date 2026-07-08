# 레시피 원가 계산기 - 개발 로드맵

## 개요
- **프로젝트 기간**: 6개 Sprint (약 6주, 각 sprint 1주)
- **스택**: Next.js 16 + TypeScript + shadcn/ui + Drizzle ORM + better-sqlite3
- **배포 대상**: 로컬 SQLite 기반 (클라우드는 COULD-HAVE)

---

## Sprint 0: 프로젝트 셋업 & 기반 구축 (1주)

### 목표
- Next.js 16 초기 프로젝트 생성
- Drizzle ORM + better-sqlite3 구성
- shadcn/ui 초기 설정
- 데이터베이스 스키마 정의 및 마이그레이션
- 프로젝트 폴더 구조 확립

### 완료 기준
- ✅ `npm run build` 성공 (에러 0개)
- ✅ `npm run lint` 성공 (경고 0개)
- ✅ 데이터베이스 마이그레이션 파일 생성 (Drizzle 0.*.config.ts, schema.ts)
- ✅ 최소 3개 테이블 생성 (Ingredient, Recipe, RecipeIngredient)
- ✅ Repository 패턴 기본 구조 (src/lib/repositories/)
- ✅ API 라우트 기본 구조 (app/api/)
- ✅ 에러 처리 유틸 함수 생성

### 작업 항목
- [ ] create-next-app으로 프로젝트 초기화 (TypeScript, App Router)
- [ ] .gitignore 구성 (*.db, *.sqlite, .env.local)
- [ ] package.json 의존성 추가 (drizzle-orm, better-sqlite3, shadcn/ui, recharts)
- [ ] next.config.ts 구성 (serverExternalPackages: ['better-sqlite3'])
- [ ] eslint.config.mjs 수동 생성 및 구성
- [ ] src/db/schema.ts 정의 (Ingredient, Recipe, RecipeIngredient, IngredientPriceHistory)
- [ ] src/db/client.ts 생성 (BetterSQLite3Database 초기화)
- [ ] src/lib/repositories/ 폴더 구조 (IngredientRepository, RecipeRepository)
- [ ] app/api/ 기본 라우트 생성 (ingredients/, recipes/)
- [ ] 에러 처리 & 로깅 유틸 (src/lib/errors.ts, src/lib/logger.ts)
- [ ] .env.local 템플릿 작성

### 기술 검증 사항
- ✅ Dynamic route params: `await params` 패턴 사용
- ✅ `import 'server-only'` in db modules
- ✅ Drizzle: `datetime` 대신 `integer(mode:'timestamp')`
- ✅ 동적 라우트 mkdir 시 백슬래시 이스케이프 금지

---

## Sprint 1: 대시보드 & 재료 관리 기본 (1주)

### 목표
- 대시보드 화면 구현 (통계, 차트)
- 재료 CRUD 기능 (생성, 조회, 수정, 삭제)
- 재료 목록 UI (카드 또는 테이블 뷰)

### 완료 기준
- ✅ 화면: 대시보드 (page.tsx)
- ✅ 화면: 재료 관리 목록 (app/ingredients/page.tsx)
- ✅ 화면: 재료 상세/수정 (app/ingredients/[id]/page.tsx)
- ✅ Recharts 차트 (수익율 분포, 재료 사용 빈도)
- ✅ 빈 상태 UI ("아직 재료가 없습니다")
- ✅ 로딩 상태 UI (스켈레톤 또는 스피너)
- ✅ 모든 한국어 UI 텍스트 적용
- ✅ 빌드 & 린트 성공

### 작업 항목
- [ ] app/page.tsx (대시보드): 평균 원가, 평균 판매가, 수익율 분포 차트
- [ ] app/ingredients/page.tsx: 재료 목록, 검색 (기본), 카드/테이블 뷰
- [ ] app/ingredients/new/page.tsx: 재료 생성 폼 (이름, 단가, 단위, 공급처)
- [ ] app/ingredients/[id]/page.tsx: 재료 상세/수정 폼
- [ ] src/components/DashboardStats.tsx: 평균값 표시 컴포넌트
- [ ] src/components/ChartRatioDistribution.tsx: 수익율 분포 차트 (Recharts)
- [ ] src/components/ChartMaterialUsage.tsx: 재료 사용 빈도 차트
- [ ] src/components/EmptyState.tsx: 빈 상태 UI 컴포넌트
- [ ] src/components/LoadingSpinner.tsx: 로딩 UI
- [ ] API: POST/GET/PUT/DELETE /api/ingredients
- [ ] src/lib/repositories/IngredientRepository.ts: CRUD 메서드

### 디자인 고려사항
- 화면 너비 600px 이상 반응형 레이아웃
- shadcn/ui Card, Button, Input, Select 사용
- 색상: 중립적 팔레트 (회색 배경, 파란 악센트)
- 폰트: sans-serif (Pretendard 또는 시스템 폰트)

---

## Sprint 2: 레시피 목록 & 상세 화면 (1주)

### 목표
- 레시피 목록 조회 (검색, 필터, 정렬 기본)
- 레시피 상세 페이지 (원가 계산, 마진 시뮬레이션)
- 레시피-재료 연결 로직 (RecipeIngredient)

### 완료 기준
- ✅ 화면: 레시피 목록 (app/recipes/page.tsx)
- ✅ 화면: 레시피 상세 (app/recipes/[id]/page.tsx)
- ✅ 실시간 원가 계산 (수량 입력 시 즉시 업데이트)
- ✅ 판매가 입력 → 수익액/수익율/마진율 자동 계산
- ✅ 목표 수익율 입력 → 추천 판매가 역산
- ✅ 검색 기능 (레시피명, 재료명)
- ✅ 정렬 기능 (최근 추가, 원가 낮은순/높은순)
- ✅ 빈 상태 UI ("아직 레시피가 없습니다")
- ✅ 모든 한국어 UI 텍스트 적용
- ✅ 빌드 & 린트 성공

### 작업 항목
- [ ] app/recipes/page.tsx: 레시피 목록 (검색, 필터, 정렬)
- [ ] app/recipes/[id]/page.tsx: 레시피 상세 (원가 계산, 마진 시뮬레이션)
- [ ] src/components/RecipeCard.tsx: 레시피 카드 (원가/판매가/수익율 표시)
- [ ] src/components/RecipeCalculator.tsx: 실시간 원가 & 마진 계산 컴포넌트
- [ ] src/components/MarginSimulator.tsx: 목표 수익율 → 추천 판매가 계산
- [ ] src/components/RecipeIngredientsTable.tsx: 레시피 재료 목록 테이블
- [ ] src/lib/repositories/RecipeRepository.ts: CRUD, 검색, 정렬 메서드
- [ ] src/lib/repositories/RecipeIngredientRepository.ts: 재료 연결 관리
- [ ] API: POST/GET/PUT/DELETE /api/recipes
- [ ] API: POST/GET /api/recipes/[id]/ingredients
- [ ] src/lib/calculations.ts: 원가, 수익율, 마진율 계산 함수

### 핵심 로직
```typescript
// 원가 계산 예시
totalCost = sum(quantity[i] / unit[i] * ingredientPrice[i])

// 수익율 계산
profitRate = ((sellingPrice - totalCost) / sellingPrice) * 100

// 마진율 계산
markupRate = ((sellingPrice - totalCost) / totalCost) * 100

// 추천 판매가 (목표 수익율 기반)
targetSellingPrice = totalCost / (1 - targetProfitRate / 100)
```

---

## Sprint 3: 레시피 생성 & 가격 변동 히스토리 (1주)

### 목표
- 신규 레시피 생성 폼 UI
- 재료 검색 & 선택 UI (인터페이스)
- 가격 변동 히스토리 기록 & 조회
- "지난달 vs 이번달" 비교 기능

### 완료 기준
- ✅ 화면: 레시피 생성 (app/recipes/new/page.tsx)
- ✅ 화면: 가격 변동 히스토리 (app/price-history/page.tsx)
- ✅ 재료 검색 드롭다운 (자동완성)
- ✅ 수량 입력 및 단위 선택 UI
- ✅ 재료 가격 변경 시 자동 히스토리 기록
- ✅ 히스토리 필터 (날짜 범위)
- ✅ "지난달 원가 vs 이번달 원가" 비교 테이블
- ✅ CSV 내보내기 기능
- ✅ 모든 한국어 UI 텍스트 적용
- ✅ 빌드 & 린트 성공

### 작업 항목
- [ ] app/recipes/new/page.tsx: 신규 레시피 폼 (이름, 카테고리, 재료 추가)
- [ ] src/components/IngredientSearchSelect.tsx: 재료 검색 & 선택 드롭다운
- [ ] src/components/RecipeIngredientForm.tsx: 재료 수량 입력 폼
- [ ] app/price-history/page.tsx: 가격 변동 기록 조회
- [ ] src/components/PriceHistoryTable.tsx: 히스토리 테이블 (변동 기록)
- [ ] src/components/MonthComparison.tsx: "지난달 vs 이번달" 비교 테이블
- [ ] src/lib/repositories/IngredientPriceHistoryRepository.ts
- [ ] API: GET /api/price-history (필터, 정렬)
- [ ] API: POST /api/ingredients/[id]/price-update (자동 히스토리 기록)
- [ ] src/lib/export.ts: CSV 내보내기 함수
- [ ] 재료 가격 업데이트 시 자동 히스토리 저장 로직

### 기능 상세
- 재료 가격 변경 시 IngredientPriceHistory 자동 기록
- 영향받는 레시피 목록 계산 (수익율 변화)
- CSV 다운로드 (브라우저 fetch → Blob → 다운로드)

---

## Sprint 4: 검색/필터 고도화 & 설정 (1주)

### 목표
- 재료, 레시피 목록에 고급 검색/필터 기능
- 카테고리별 필터
- 정렬 옵션 확대
- 사용자 설정 화면 (카테고리 관리, 데이터 초기화)

### 완료 기준
- ✅ 재료 검색: 재료명 + 카테고리 필터 + 정렬
- ✅ 레시피 검색: 레시피명 + 재료명 + 카테고리 필터 + 정렬
- ✅ 페이지네이션 (20개/페이지)
- ✅ 화면: 설정 (app/settings/page.tsx)
- ✅ 기본 카테고리 관리 (추가/삭제)
- ✅ 데이터 초기화 (전체 삭제 확인)
- ✅ CSV 대량 수입 (재료 일괄 등록)
- ✅ 모든 한국어 UI 텍스트 적용
- ✅ 빌드 & 린트 성공

### 작업 항목
- [ ] src/components/AdvancedSearchFilter.tsx: 고급 검색/필터 컴포넌트
- [ ] src/components/Pagination.tsx: 페이지네이션 컴포넌트
- [ ] app/ingredients/page.tsx: 필터 및 정렬 기능 추가
- [ ] app/recipes/page.tsx: 필터 및 정렬 기능 추가
- [ ] app/settings/page.tsx: 설정 화면 (카테고리, 데이터 초기화, CSV 수입)
- [ ] src/components/CategoryManager.tsx: 카테고리 관리 (추가/삭제)
- [ ] src/components/CSVImport.tsx: CSV 파일 업로드 폼
- [ ] src/lib/csv.ts: CSV 파싱 함수 (재료 대량 수입)
- [ ] API: GET /api/ingredients (쿼리: search, category, sort, limit, offset)
- [ ] API: GET /api/recipes (쿼리: search, category, sort, limit, offset)
- [ ] API: POST /api/csv/import-ingredients (파일 업로드)
- [ ] API: POST /api/settings/reset (데이터 초기화)

### 검색/필터 쿼리 예시
```
GET /api/recipes?search=밀가루&category=베이커리&sort=cost_asc&limit=20&offset=0
```

---

## Sprint 5: 차트/통계 개선 & 테스트 (1주)

### 목표
- 대시보드 차트 완성 (4가지 이상)
- 통계 데이터 정확도 검증
- 전체 UI/UX 검수
- 로딩 & 에러 상태 일관성

### 완료 기준
- ✅ 차트 4개 이상 (수익율 분포, 재료 사용 빈도, 원가별 분포, 월간 추이)
- ✅ 차트 색상 일관성 (다크/라이트 모드 지원)
- ✅ 모든 화면 로딩 상태 표시
- ✅ 모든 화면 에러 상태 처리
- ✅ 빈 상태 메시지 모든 페이지에서 일관성
- ✅ 계산 정확도 검증 (단위 변환, 원가 계산, 마진율)
- ✅ 모바일 600px 반응형 레이아웃 검증
- ✅ 빌드 & 린트 성공

### 작업 항목
- [ ] src/components/ChartCostDistribution.tsx: 원가별 레시피 분포 차트
- [ ] src/components/ChartMonthlyRecipes.tsx: 월간 레시피 추가 추이 차트
- [ ] 차트 데이터 쿼리 최적화 (SQL 집계)
- [ ] 다크 모드 색상 팔레트 정의 (라이트/다크)
- [ ] 모바일 반응형 테스트 (600px, 768px, 1024px)
- [ ] 에러 경계 컴포넌트 (ErrorBoundary)
- [ ] 계산 함수 테스트 (calculateTotalCost, calculateProfitRate 등)
- [ ] 단위 변환 테스트 (kg ↔ g, 개 ↔ 팩)
- [ ] 페이지 로딩 성능 최적화

---

## Sprint 6: 최종 QA & 문서 작성 (1주)

### 목표
- 전체 기능 QA 및 버그 수정
- README.md 작성
- 배포 준비 (빌드 최적화, 성능 검사)
- 긴급 버그 수정

### 완료 기준
- ✅ 7개 이상 화면 완성
- ✅ 모든 MUST-HAVE 기능 동작
- ✅ 한국어 UI 텍스트 100% (영어 없음)
- ✅ 빌드 에러 0개, 린트 경고 0개
- ✅ TypeScript 타입 에러 0개
- ✅ 함수 200줄 이하
- ✅ Repository 패턴 완성
- ✅ 명시적 에러 처리 100%
- ✅ .gitignore에 *.db, *.sqlite, .env.local 포함
- ✅ README.md 작성 (한국어, 기능 목록, 설치/실행 방법, 스크린샷 자리)
- ✅ 커밋 7개 이상 (화면별 커밋)

### 작업 항목
- [ ] 전체 기능 테스트 (모든 화면, 모든 액션)
- [ ] 계산 정확도 재검증
- [ ] 단위 변환 엣지 케이스 테스트
- [ ] 빈 상태, 로딩, 에러 상태 모든 페이지 검증
- [ ] 성능 프로파일링 (Chrome DevTools)
- [ ] 이미지 최적화 (있는 경우)
- [ ] 번들 크기 검사 (최적화 여부)
- [ ] README.md 작성 (기능, 기술 스택, 설치, 스크린샷)
- [ ] 라이선스 파일 추가 (MIT)
- [ ] .gitignore 최종 검증
- [ ] 전체 커밋 히스토리 검토

### 최종 체크리스트
- [ ] `npx tsc --noEmit` → exit code 0
- [ ] `npm run lint` → exit code 0
- [ ] `npm run build` → exit code 0
- [ ] `find app -name page.tsx | wc -l` ≥ 7
- [ ] `grep -rl '검색' app components src` ≥ 1 (검색 기능)
- [ ] `grep -rl '대시보드' app components src` ≥ 1 (대시보드)
- [ ] 데이터베이스 파일 로컬 저장 확인
- [ ] 첫 실행 시 테이블 자동 생성 테스트

---

## 데이터베이스 스키마 (Drizzle ORM)

```typescript
// src/db/schema.ts

import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 재료 테이블
export const ingredients = sqliteTable('ingredients', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(), // 곡류, 육류 등
  unitPrice: real('unit_price').notNull(),
  unit: text('unit').notNull(), // kg, g, 개 등
  supplier: text('supplier'),
  supplierPhone: text('supplier_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 레시피 테이블
export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  totalCostWon: real('total_cost_won').default(0),
  soldPrice: real('sold_price'),
  margin: real('margin'), // 수익율 (%)
  markup: real('markup'), // 마진율 (%)
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 레시피-재료 연결 테이블
export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id').notNull().references(() => recipes.id),
  ingredientId: text('ingredient_id').notNull().references(() => ingredients.id),
  quantity: real('quantity').notNull(),
  unit: text('unit').notNull(),
  costForThisRecipe: real('cost_for_this_recipe').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 재료비 변동 이력 테이블
export const ingredientPriceHistory = sqliteTable('ingredient_price_history', {
  id: text('id').primaryKey(),
  ingredientId: text('ingredient_id').notNull().references(() => ingredients.id),
  oldPrice: real('old_price').notNull(),
  newPrice: real('new_price').notNull(),
  changedAt: integer('changed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

---

## 컴포넌트 구조

```
src/
├── components/
│   ├── DashboardStats.tsx
│   ├── ChartRatioDistribution.tsx
│   ├── ChartMaterialUsage.tsx
│   ├── ChartCostDistribution.tsx
│   ├── ChartMonthlyRecipes.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeCalculator.tsx
│   ├── MarginSimulator.tsx
│   ├── RecipeIngredientsTable.tsx
│   ├── IngredientSearchSelect.tsx
│   ├── RecipeIngredientForm.tsx
│   ├── PriceHistoryTable.tsx
│   ├── MonthComparison.tsx
│   ├── CategoryManager.tsx
│   ├── CSVImport.tsx
│   ├── AdvancedSearchFilter.tsx
│   ├── Pagination.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
│
├── db/
│   ├── schema.ts
│   └── client.ts
│
├── lib/
│   ├── repositories/
│   │   ├── IngredientRepository.ts
│   │   ├── RecipeRepository.ts
│   │   ├── RecipeIngredientRepository.ts
│   │   └── IngredientPriceHistoryRepository.ts
│   ├── calculations.ts
│   ├── csv.ts
│   ├── export.ts
│   ├── errors.ts
│   └── logger.ts
│
└── app/
    ├── page.tsx (대시보드)
    ├── ingredients/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/page.tsx
    ├── recipes/
    │   ├── page.tsx
    │   ├── new/page.tsx
    │   └── [id]/page.tsx
    ├── price-history/
    │   └── page.tsx
    ├── settings/
    │   └── page.tsx
    └── api/
        ├── ingredients/[id].ts
        ├── recipes/[id].ts
        └── csv/import.ts
```

---

## 주요 마일스톤

| 마일스톤 | Sprint | 기준 |
|---------|--------|------|
| 기반 구축 완료 | Sprint 0 | 빌드 성공, 데이터베이스 초기화 |
| MVP 기본 기능 | Sprint 1-2 | 7개 화면, 원가 계산 정상 |
| 고급 기능 | Sprint 3-4 | 검색/필터, 히스토리, 통계 |
| 최적화 & QA | Sprint 5-6 | 빌드 에러 0, 모든 한국어 UI |
| **출시 준비** | **Sprint 6 말** | **README.md, 커밋 7개 이상, 빌드 성공** |

---

## 주의사항 (Next.js 16 함정)

### ⚠️ 동적 라우트 params
```typescript
// ❌ WRONG
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id; // params가 Promise일 수 있음
}

// ✅ CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### ⚠️ next.lint 제거
- `npm run lint`는 `eslint .`로 변경
- eslint.config.mjs 수동 생성 (eslint-config-next/core-web-vitals + /typescript 포함)

### ⚠️ Drizzle datetime 미지원
```typescript
// ❌ WRONG
import { datetime } from 'drizzle-orm/sqlite-core';
export const table = sqliteTable('t', { createdAt: datetime('created_at') });

// ✅ CORRECT
export const table = sqliteTable('t', { 
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});
```

### ⚠️ 동적 라우트 디렉토리 mkdir
```bash
# ❌ WRONG (백슬래시 이스케이프)
mkdir -p app/recipes/\\[id\\]

# ✅ CORRECT (따옴표 사용)
mkdir -p "app/recipes/[id]"
```

### ⚠️ better-sqlite3 서버-only
```typescript
// src/db/client.ts 최상단
import 'server-only';

// next.config.ts
export default {
  serverExternalPackages: ['better-sqlite3'],
};
```

### ⚠️ 클라이언트 컴포넌트 DB 접근
- ❌ 클라이언트 컴포넌트에서 db.query() 직접 호출
- ✅ API 라우트 → 서버 컴포넌트 → 클라이언트 컴포넌트

---

## 완료 후 최종 확인

```bash
# 1. 타입 검사
npx tsc --noEmit > /tmp/tsc.log 2>&1
echo $?  # 0이어야 함

# 2. 린트
npm run lint > /tmp/lint.log 2>&1
echo $?  # 0이어야 함

# 3. 빌드
npm run build > /tmp/build.log 2>&1
echo $?  # 0이어야 함

# 4. 화면 수 확인
find app -name page.tsx | wc -l  # 7 이상

# 5. 검색 기능 확인
grep -rl '검색' app components src  # 최소 1개

# 6. 대시보드 확인
grep -rl '대시보드' app components src  # 최소 1개

# 7. .gitignore 확인
grep -E '\.db|\.sqlite|\.env\.local' .gitignore
```

