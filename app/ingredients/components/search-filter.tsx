"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFilterProps {
  search: string;
  category: string;
  categories: string[];
  sortBy: "name" | "price";
}

export function SearchFilter({
  search,
  category,
  categories,
  sortBy,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/ingredients?${params.toString()}`);
    });
  };

  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
      }
      router.push(`/ingredients?${params.toString()}`);
    });
  };

  const handleSortChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value !== "name") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      router.push(`/ingredients?${params.toString()}`);
    });
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <input
        type="text"
        placeholder="재료명 검색..."
        defaultValue={search}
        disabled={isPending}
        className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <select
        defaultValue={category}
        disabled={isPending}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value="">모든 카테고리</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        defaultValue={sortBy}
        disabled={isPending}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="name">이름 순</option>
        <option value="price">가격 순</option>
      </select>
    </div>
  );
}
