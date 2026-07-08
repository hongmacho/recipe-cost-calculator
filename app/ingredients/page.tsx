import { ingredientRepository } from "@/lib/repositories/ingredient.repository";
import { formatCurrency } from "@/lib/utils/calculations";
import Link from "next/link";
import { SearchFilter } from "./components/search-filter";

export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  category?: string;
  sort?: string;
}

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const sortBy = (params.sort === "price" ? "price" : "name") as
    | "name"
    | "price";

  try {
    const { items, total } = await ingredientRepository.findAll({
      search,
      category,
      sortBy,
      limit: 50,
    });

    const categories = await ingredientRepository.findAllCategories();

    const isEmpty = items.length === 0 && !search && !category;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">재료 관리</h1>
              <Link
                href="/ingredients/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                재료 추가
              </Link>
            </div>

            {/* 검색 & 필터 (클라이언트 컴포넌트) */}
            <SearchFilter
              search={search}
              category={category}
              categories={categories}
              sortBy={sortBy}
            />
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isEmpty ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-lg text-gray-600 mb-4">
                아직 재료가 등록되지 않았습니다.
              </p>
              <p className="text-gray-500 mb-6">
                첫 재료를 추가하여 시작하세요.
              </p>
              <Link
                href="/ingredients/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                첫 재료 추가하기
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-lg text-gray-600 mb-4">
                검색 결과가 없습니다.
              </p>
              <p className="text-gray-500 mb-6">
                다른 검색어나 필터를 시도해주세요.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                총 {total}개의 재료 ({search || category ? "필터됨" : "전체"})
              </div>

              {/* 재료 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((ingredient) => (
                  <Link
                    key={ingredient.id}
                    href={`/ingredients/${ingredient.id}`}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-500 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {ingredient.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {ingredient.category}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {ingredient.unit}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(ingredient.unitPrice)}
                      </p>
                      <p className="text-xs text-gray-600">
                        단위당 가격
                      </p>
                    </div>

                    {ingredient.supplier && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">공급처:</span>{" "}
                          {ingredient.supplier}
                        </p>
                        {ingredient.supplierPhone && (
                          <p className="text-sm text-gray-600">
                            {ingredient.supplierPhone}
                          </p>
                        )}
                      </div>
                    )}

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
    console.error("재료 조회 오류:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg text-red-600 font-medium mb-2">
            오류가 발생했습니다
          </p>
          <p className="text-gray-600 mb-6">
            재료 목록을 불러올 수 없습니다. 다시 시도해주세요.
          </p>
          <Link
            href="/ingredients"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도
          </Link>
        </div>
      </div>
    );
  }
}
