import { recipeRepository } from "@/lib/repositories/recipe.repository";
import { ingredientRepository } from "@/lib/repositories/ingredient.repository";
import { db } from "@/db/client";
import { recipeIngredients } from "@/db/schema";
import { formatCurrency, formatPercent } from "@/lib/utils/calculations";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface DashboardStats {
  averageCost: number;
  averageSoldPrice: number;
  averageMargin: number;
  totalRecipes: number;
  totalIngredients: number;
}

interface TopIngredient {
  name: string;
  usageCount: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const recipeStats = await recipeRepository.getStatistics();
    const allIngredients = await ingredientRepository.findAll({ limit: 999 });

    return {
      averageCost: recipeStats.averageCost,
      averageSoldPrice: recipeStats.averageSoldPrice,
      averageMargin: recipeStats.averageMargin,
      totalRecipes: recipeStats.totalRecipes,
      totalIngredients: allIngredients.total,
    };
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error);
    return {
      averageCost: 0,
      averageSoldPrice: 0,
      averageMargin: 0,
      totalRecipes: 0,
      totalIngredients: 0,
    };
  }
}

async function getTopIngredients(): Promise<TopIngredient[]> {
  try {
    const allIngredientsList = await db
      .select()
      .from(recipeIngredients);

    // JavaScript에서 집계 (ingredientId별 count)
    const ingredientUsage = new Map<string, number>();
    allIngredientsList.forEach((item) => {
      const count = ingredientUsage.get(item.ingredientId) || 0;
      ingredientUsage.set(item.ingredientId, count + 1);
    });

    // TOP 5로 정렬
    const topIds = Array.from(ingredientUsage.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);

    const ingredientNames = await Promise.all(
      topIds.map(async (id) => {
        const ingredient = await ingredientRepository.findById(id);
        return {
          id,
          name: ingredient?.name || "알 수 없음",
          usageCount: ingredientUsage.get(id) || 0,
        };
      })
    );

    return ingredientNames.map((ing) => ({
      name: ing.name,
      usageCount: ing.usageCount,
    }));
  } catch (error) {
    console.error("인기 재료 조회 오류:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const topIngredients = await getTopIngredients();

  const hasRecipes = stats.totalRecipes > 0;
  const hasIngredients = stats.totalIngredients > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <nav className="flex gap-4">
              <Link
                href="/ingredients"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition"
              >
                재료 관리
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition"
              >
                레시피 목록
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasIngredients && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              먼저 재료를 추가하세요
            </h3>
            <p className="text-blue-700 mb-4">
              레시피를 만들기 전에 재료 데이터베이스를 구성해주세요.
            </p>
            <Link
              href="/ingredients/new"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              첫 재료 추가하기
            </Link>
          </div>
        )}

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 평균 원가 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">평균 원가</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.averageCost)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              총 {stats.totalRecipes}개 레시피
            </p>
          </div>

          {/* 평균 판매가 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-medium">평균 판매가</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.averageSoldPrice)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalRecipes > 0 ? "계산됨" : "데이터 없음"}
            </p>
          </div>

          {/* 평균 수익율 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 font-medium">평균 수익율</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatPercent(stats.averageMargin)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.averageMargin > 0 ? "양호" : "판매가 미설정"}
            </p>
          </div>

          {/* 총 재료 수 */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 font-medium">등록된 재료</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalIngredients}개
            </p>
            <p className="text-xs text-gray-500 mt-1">
              레시피에 사용 가능
            </p>
          </div>
        </div>

        {/* 인기 재료 섹션 */}
        {hasRecipes && topIngredients.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              인기 재료 TOP 5
            </h2>
            <div className="space-y-3">
              {topIngredients.map((ingredient, index) => (
                <div key={ingredient.name} className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-gray-400 w-8">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {ingredient.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ingredient.usageCount}개 레시피에서 사용
                    </p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (ingredient.usageCount / (topIngredients[0]?.usageCount || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!hasRecipes && hasIngredients && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              아직 레시피가 없습니다.
            </p>
            <p className="text-gray-500 mb-6">
              첫 레시피를 만들어 원가 계산을 시작하세요.
            </p>
            <Link
              href="/recipes/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              첫 레시피 만들기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
