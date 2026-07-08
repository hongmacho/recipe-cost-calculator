/**
 * 단위 변환 함수
 * kg, g, 개, 병, 팩 등 다양한 단위를 통일하여 비교합니다.
 */
export type Unit = "kg" | "g" | "개" | "병" | "팩" | "ml" | "l" | "스푼" | "컵";

interface UnitConversion {
  toGram: number; // 1 unit = ? gram
}

const unitConversions: Record<Unit, UnitConversion> = {
  kg: { toGram: 1000 },
  g: { toGram: 1 },
  개: { toGram: 1 }, // 개는 그대로 (개수 기준)
  병: { toGram: 1 }, // 병은 그대로 (병 기준)
  팩: { toGram: 1 }, // 팩은 그대로 (팩 기준)
  ml: { toGram: 1 }, // ml은 그대로 (ml 기준)
  l: { toGram: 1000 }, // 1L = 1000ml
  스푼: { toGram: 15 }, // 1 스푼 ≈ 15g
  컵: { toGram: 240 }, // 1 컵 ≈ 240ml
};

/**
 * 단위 정규화
 * 주어진 단위가 유효한지 확인하고, 표준 단위로 변환합니다.
 */
export function normalizeUnit(unit: string): Unit | null {
  const normalized = unit.toLowerCase().trim();
  const validUnits = Object.keys(unitConversions) as Unit[];
  return validUnits.find((u) => u === normalized) || null;
}

/**
 * 단위 변환
 * 예: convertQuantity(500, 'g', 'kg') => 0.5
 */
export function convertQuantity(
  quantity: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  if (!quantity || quantity < 0) return 0;

  // 동일 단위면 그대로 반환
  if (fromUnit === toUnit) return quantity;

  // weight 기반 변환 (kg, g만 변환)
  if (
    (fromUnit === "kg" || fromUnit === "g") &&
    (toUnit === "kg" || toUnit === "g")
  ) {
    const gramValue = quantity * unitConversions[fromUnit].toGram;
    return gramValue / unitConversions[toUnit].toGram;
  }

  // volume 기반 변환 (ml, l만 변환)
  if (
    (fromUnit === "ml" || fromUnit === "l") &&
    (toUnit === "ml" || toUnit === "l")
  ) {
    const mlValue =
      quantity * (fromUnit === "l" ? 1000 : 1);
    return mlValue / (toUnit === "l" ? 1000 : 1);
  }

  // 변환 불가능 (예: g에서 개로)
  return quantity;
}

/**
 * 원가 계산
 * (수량 / 단위당 구매량) * 단가
 * 예: 밀가루 300g, 단가 2000원/kg => 600원
 */
export function calculateCostForIngredient(
  quantity: number,
  quantityUnit: Unit,
  unitPrice: number,
  priceUnit: Unit
): number {
  if (quantity <= 0 || unitPrice <= 0) return 0;

  // 수량과 가격 단위를 동일하게 변환
  const standardUnit = "g"; // 기본 표준 단위

  const quantityInStandard = convertQuantity(quantity, quantityUnit, standardUnit as Unit);
  const pricePerStandardUnit = unitPrice / convertQuantity(1, priceUnit, standardUnit as Unit);

  return Math.round((quantityInStandard * pricePerStandardUnit) * 100) / 100;
}

/**
 * 총 원가 계산
 * 모든 재료의 원가를 합산합니다.
 */
export function calculateTotalCost(costs: number[]): number {
  const total = costs.reduce((sum, cost) => sum + cost, 0);
  return Math.round(total * 100) / 100; // 소수점 2자리
}

/**
 * 수익율 계산
 * (판매가 - 원가) / 판매가 * 100 (%)
 * 수익율은 판매가 기준의 이익 비율입니다.
 */
export function calculateProfitMargin(
  sellingPrice: number,
  totalCost: number
): number {
  if (sellingPrice <= 0 || sellingPrice < totalCost) return 0;
  const margin = ((sellingPrice - totalCost) / sellingPrice) * 100;
  return Math.round(margin * 100) / 100; // 소수점 2자리
}

/**
 * 마진율 계산
 * (판매가 - 원가) / 원가 * 100 (%)
 * 마진율은 원가 기준의 이익 비율입니다.
 */
export function calculateMarkupRate(
  sellingPrice: number,
  totalCost: number
): number {
  if (totalCost <= 0) return 0;
  if (sellingPrice <= totalCost) return 0;

  const markup = ((sellingPrice - totalCost) / totalCost) * 100;
  return Math.round(markup * 100) / 100; // 소수점 2자리
}

/**
 * 수익액 계산
 */
export function calculateProfit(
  sellingPrice: number,
  totalCost: number
): number {
  if (sellingPrice <= 0) return 0;
  return Math.round((sellingPrice - totalCost) * 100) / 100;
}

/**
 * 목표 수익율 기반 추천 판매가 계산
 * 판매가 = 원가 / (1 - 목표수익율/100)
 */
export function calculateRecommendedPrice(
  totalCost: number,
  targetMarginPercent: number
): number {
  if (totalCost <= 0 || targetMarginPercent <= 0) return totalCost;
  if (targetMarginPercent >= 100) return totalCost * 2; // 최대 100% 수익율

  const recommendedPrice = totalCost / (1 - targetMarginPercent / 100);
  return Math.round(recommendedPrice * 100) / 100;
}

/**
 * 가격 변동 영향 분석
 * 이전 가격 대비 현재 가격의 변동을 계산합니다.
 */
export function calculatePriceChangePercent(
  oldPrice: number,
  newPrice: number
): number {
  if (oldPrice <= 0) return 0;
  const change = ((newPrice - oldPrice) / oldPrice) * 100;
  return Math.round(change * 100) / 100; // 소수점 2자리
}

/**
 * 한국 원화 포맷팅
 * 예: 1000 => "1,000원"
 */
export function formatCurrency(amount: number): string {
  if (!amount || amount < 0) return "0원";
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 백분율 포맷팅
 * 예: 58.3 => "58.3%"
 */
export function formatPercent(percent: number): string {
  if (!percent || percent < 0) return "0%";
  return `${Math.round(percent * 10) / 10}%`;
}
