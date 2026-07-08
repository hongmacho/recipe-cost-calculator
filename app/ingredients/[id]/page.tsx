"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/calculations";

const UNITS = ["kg", "g", "개", "병", "팩", "ml", "l", "스푼", "컵"];
const CATEGORIES = ["곡류", "육류", "유제품", "향신료", "채소", "과일", "음료", "기타"];

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  supplier?: string;
  supplierPhone?: string;
}

export default function IngredientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await fetch(`/api/ingredients/${id}`);
        if (!response.ok) throw new Error("재료를 찾을 수 없습니다");
        const data = await response.json();
        setIngredient(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
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
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "저장 실패");
      }

      const result = await response.json();
      setIngredient(result.data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;

    try {
      const response = await fetch(`/api/ingredients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("삭제 실패");
      router.push("/ingredients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg text-red-600 font-medium mb-2">
            재료를 찾을 수 없습니다
          </p>
          <Link
            href="/ingredients"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "재료 수정" : ingredient.name}
            </h1>
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">오류</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {isEditing ? (
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* 재료명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재료명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={ingredient.name}
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
                  defaultValue={ingredient.category}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
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
                  defaultValue={ingredient.unitPrice}
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
                  defaultValue={ingredient.unit}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
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
                  defaultValue={ingredient.supplier || ""}
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
                  defaultValue={ingredient.supplierPhone || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">카테고리</p>
                <p className="text-lg text-gray-900 mt-1">{ingredient.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium">단가</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(ingredient.unitPrice)}
                  <span className="text-lg text-gray-500 ml-2">/ {ingredient.unit}</span>
                </p>
              </div>

              {ingredient.supplier && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">공급처</p>
                    <p className="text-lg text-gray-900 mt-1">
                      {ingredient.supplier}
                    </p>
                  </div>
                  {ingredient.supplierPhone && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium">전화</p>
                      <p className="text-lg text-gray-900 mt-1">
                        {ingredient.supplierPhone}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="pt-6 border-t border-gray-200 flex gap-2">
                <Link
                  href="/ingredients"
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium text-center"
                >
                  목록으로
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
