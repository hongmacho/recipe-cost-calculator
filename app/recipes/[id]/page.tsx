"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatPercent, calculateProfitMargin, calculateMarkupRate } from "@/lib/utils/calculations";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costForThisRecipe: number;
}

interface Recipe {
  id: string;
  name: string;
  category?: string;
  totalCostWon: number;
  soldPrice?: number;
  margin?: number;
  markup?: number;
  ingredientsList?: Ingredient[];
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [soldPrice, setSoldPrice] = useState<number>(0);
  const [targetMargin, setTargetMargin] = useState<number>(50);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) throw new Error("레시피를 찾을 수 없습니다");
        const data = await response.json();
        setRecipe(data.data);
        setSoldPrice(data.data.soldPrice || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg text-red-600 font-medium mb-2">
            레시피를 찾을 수 없습니다
          </p>
          <Link
            href="/recipes"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const profit = soldPrice - recipe.totalCostWon;
  const profitMargin = calculateProfitMargin(soldPrice, recipe.totalCostWon);
  const markupRate = calculateMarkupRate(soldPrice, recipe.totalCostWon);
  const recommendedPrice = recipe.totalCostWon / (1 - targetMargin / 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
          {recipe.category && (
            <p className="text-gray-600 mt-1">{recipe.category}</p>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 원가 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">원가 정보</h2>
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(recipe.totalCostWon)}
          </p>
          <p className="text-gray-600 mt-2">총 원가</p>
        </div>

        {/* 재료 목록 */}
        {recipe.ingredientsList && recipe.ingredientsList.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">재료 목록</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">재료</th>
                    <th className="text-right px-4 py-2 font-semibold">수량</th>
                    <th className="text-right px-4 py-2 font-semibold">원가</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.ingredientsList.map((ing) => (
                    <tr key={ing.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{ing.name}</td>
                      <td className="text-right px-4 py-3">
                        {ing.quantity} {ing.unit}
                      </td>
                      <td className="text-right px-4 py-3 font-medium">
                        {formatCurrency(ing.costForThisRecipe)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 마진 시뮬레이션 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            마진 시뮬레이션
          </h2>

          <div className="space-y-6">
            {/* 판매가 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                판매가 (원)
              </label>
              <input
                type="number"
                value={soldPrice}
                onChange={(e) => setSoldPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 계산 결과 */}
            {soldPrice > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">수익액</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatCurrency(profit)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">수익율</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {formatPercent(profitMargin)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">마진율</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {formatPercent(markupRate)}
                  </p>
                </div>
              </div>
            )}

            {/* 목표 수익율 설정 */}
            <div className="pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 수익율 (%)
              </label>
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                min="0"
                max="99"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-sm text-gray-600 mt-3 p-3 bg-blue-50 rounded">
                <span className="font-medium">추천 판매가:</span>{" "}
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(recommendedPrice)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <Link
            href="/recipes"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium text-center"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
