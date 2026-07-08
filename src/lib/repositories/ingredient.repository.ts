import { db } from "@/db/client";
import { ingredients, ingredientPriceHistory } from "@/db/schema";
import { eq, like, and, asc, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { AlreadyExistsError, NotFoundError } from "@/lib/utils/errors";

export interface CreateIngredientInput {
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  supplier?: string;
  supplierPhone?: string;
}

export interface UpdateIngredientInput {
  name?: string;
  category?: string;
  unitPrice?: number;
  unit?: string;
  supplier?: string;
  supplierPhone?: string;
}

/**
 * 재료 Repository
 * 데이터베이스 접근을 추상화하여 비즈니스 로직과 분리합니다.
 */
export class IngredientRepository {
  /**
   * 모든 재료 조회
   * 카테고리 필터링, 검색, 정렬 지원
   */
  async findAll(filters?: {
    search?: string;
    category?: string;
    sortBy?: "name" | "price";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ items: typeof ingredients.$inferSelect[]; total: number }> {
    const {
      search,
      category,
      sortBy = "name",
      sortOrder = "asc",
      limit = 20,
      offset = 0,
    } = filters || {};

    // 필터 조건 구성
    const conditions: Array<ReturnType<typeof eq | typeof like>> = [];
    if (search) {
      conditions.push(like(ingredients.name, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(ingredients.category, category));
    }

    const whereClause =
      conditions.length > 1
        ? and(...conditions)
        : conditions.length === 1
          ? conditions[0]
          : undefined;

    // 정렬 필드
    const sortField =
      sortBy === "price" ? ingredients.unitPrice : ingredients.name;

    // 전체 개수 조회 (복잡한 쿼리는 all()로 가져와서 개수 계산)
    const allRecords = whereClause
      ? await db
          .select()
          .from(ingredients)
          .where(whereClause)
      : await db.select().from(ingredients);

    const total = allRecords.length;

    // 데이터 조회 (정렬 및 페이지네이션)
    const items = whereClause
      ? await db
          .select()
          .from(ingredients)
          .where(whereClause)
          .orderBy(sortOrder === "desc" ? desc(sortField) : asc(sortField))
          .limit(limit)
          .offset(offset)
      : await db
          .select()
          .from(ingredients)
          .orderBy(sortOrder === "desc" ? desc(sortField) : asc(sortField))
          .limit(limit)
          .offset(offset);

    return { items, total };
  }

  /**
   * ID로 재료 조회
   */
  async findById(id: string): Promise<typeof ingredients.$inferSelect | null> {
    const result = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, id),
    });
    return result || null;
  }

  /**
   * 이름으로 재료 조회 (중복 방지)
   */
  async findByName(name: string): Promise<typeof ingredients.$inferSelect | null> {
    const result = await db.query.ingredients.findFirst({
      where: eq(ingredients.name, name),
    });
    return result || null;
  }

  /**
   * 재료 생성
   */
  async create(input: CreateIngredientInput): Promise<typeof ingredients.$inferSelect> {
    const existing = await this.findByName(input.name);
    if (existing) {
      throw new AlreadyExistsError("재료", "이름", input.name);
    }

    const id = randomUUID();
    const created = await db
      .insert(ingredients)
      .values({
        id,
        ...input,
      })
      .returning();

    return created[0];
  }

  /**
   * 재료 업데이트
   * 단가 변경 시 자동으로 가격 변동 이력을 기록합니다.
   */
  async update(
    id: string,
    input: UpdateIngredientInput
  ): Promise<typeof ingredients.$inferSelect> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("재료", id);
    }

    // 이름 중복 체크 (다른 재료의 이름)
    if (input.name && input.name !== existing.name) {
      const duplicate = await this.findByName(input.name);
      if (duplicate) {
        throw new AlreadyExistsError("재료", "이름", input.name);
      }
    }

    // 단가 변경 이력 기록
    if (input.unitPrice && input.unitPrice !== existing.unitPrice) {
      await db.insert(ingredientPriceHistory).values({
        id: randomUUID(),
        ingredientId: id,
        oldPrice: existing.unitPrice,
        newPrice: input.unitPrice,
      });
    }

    const updated = await db
      .update(ingredients)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(ingredients.id, id))
      .returning();

    return updated[0];
  }

  /**
   * 재료 삭제
   */
  async delete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("재료", id);
    }

    await db.delete(ingredients).where(eq(ingredients.id, id));
  }

  /**
   * 모든 카테고리 조회
   */
  async findAllCategories(): Promise<string[]> {
    const result = await db
      .selectDistinct({ category: ingredients.category })
      .from(ingredients)
      .orderBy(ingredients.category);

    return result.map((r) => r.category);
  }
}

export const ingredientRepository = new IngredientRepository();
