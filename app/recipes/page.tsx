import { recipeRepository } from "@/lib/repositories/recipe.repository";
import { formatCurrency, formatPercent } from "@/lib/utils/calculations";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecipesPage() {
  try {
    const { items, total } = await recipeRepository.findAll({ limit: 50 });

    const isEmpty = items.length === 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">레시피 목록</h1>
              <Link
                href="/recipes/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                레시피 추가
              </Link>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isEmpty ? (
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
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                총 {total}개의 레시피
              </div>

              {/* 레시피 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-green-500 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {recipe.name}
                        </h3>
                        {recipe.category && (
                          <p className="text-sm text-gray-500">
                            {recipe.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">원가:</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(recipe.totalCostWon || 0)}
                        </span>
                      </div>
                      {recipe.soldPrice && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">판매가:</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(recipe.soldPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">수익율:</span>
                            <span className="font-bold text-green-600">
                              {formatPercent(recipe.margin || 0)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                        수정
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition">
                        삭제
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("레시피 조회 오류:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg text-red-600 font-medium mb-2">
            오류가 발생했습니다
          </p>
          <p className="text-gray-600 mb-6">
            레시피 목록을 불러올 수 없습니다.
          </p>
          <Link
            href="/recipes"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도
          </Link>
        </div>
      </div>
    );
  }
}
