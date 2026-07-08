"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UNITS = ["kg", "g", "개", "병", "팩", "ml", "l", "스푼", "컵"];
const CATEGORIES = ["곡류", "육류", "유제품", "향신료", "채소", "과일", "음료", "기타"];

export default function NewIngredientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      unitPrice: parseFloat(formData.get("unitPrice") as string),
      unit: formData.get("unit"),
      supplier: formData.get("supplier"),
      supplierPhone: formData.get("supplierPhone"),
    };

    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "재료 추가 실패");
      }

      router.push("/ingredients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">새 재료 추가</h1>
        </div>
      </div>

      {/* 폼 */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">오류</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 재료명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                재료명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="예: 밀가루, 계란"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">선택...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 단가 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                단가 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="unitPrice"
                placeholder="2000"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 단위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                단위 <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">선택...</option>
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* 공급처 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공급처 (선택사항)
              </label>
              <input
                type="text"
                name="supplier"
                placeholder="예: 마트명, 도매상"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 공급처 전화 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공급처 전화 (선택사항)
              </label>
              <input
                type="tel"
                name="supplierPhone"
                placeholder="010-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
              <Link
                href="/ingredients"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium text-center"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
