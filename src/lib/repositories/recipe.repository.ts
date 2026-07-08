import { db } from "@/db/client";
import {
  recipes,
  recipeIngredients,
  ingredients,
} from "@/db/schema";
import { eq, like, and, asc, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { NotFoundError } from "@/lib/utils/errors";

export interface CreateRecipeInput {
  name: string;
  category?: string;
}

export interface UpdateRecipeInput {
  name?: string;
  category?: string;
  totalCostWon?: number;
  soldPrice?: number;
  margin?: number;
  markup?: number;
}

export type Recipe = typeof recipes.$inferSelect;
export type RecipeWithIngredients = Recipe & {
  ingredientsList?: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    costForThisRecipe: number;
  }>;
};

/**
 * 레시피 Repository
 */
export class RecipeRepository {
  /**
   * 모든 레시피 조회
   */
  async findAll(filters?: {
    search?: string;
    category?: string;
    sortBy?: "name" | "cost" | "created";
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<{ items: typeof recipes.$inferSelect[]; total: number }> {
    const {
      search,
      category,
      sortBy = "created",
      sortOrder = "desc",
      limit = 20,
      offset = 0,
    } = filters || {};

    const conditions: Array<ReturnType<typeof eq | typeof like>> = [];
    if (search) {
      conditions.push(like(recipes.name, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(recipes.category, category));
    }

    const whereClause =
      conditions.length > 1
        ? and(...conditions)
        : conditions.length === 1
          ? conditions[0]
          : undefined;

    const sortField =
      sortBy === "cost"
        ? recipes.totalCostWon
        : sortBy === "name"
          ? recipes.name
          : recipes.createdAt;

    const allRecords = whereClause
      ? await db
          .select()
          .from(recipes)
          .where(whereClause)
      : await db.select().from(recipes);

    const total = allRecords.length;

    const items = whereClause
      ? await db
          .select()
          .from(recipes)
          .where(whereClause)
          .orderBy(sortOrder === "desc" ? desc(sortField) : asc(sortField))
          .limit(limit)
          .offset(offset)
      : await db
          .select()
          .from(recipes)
          .orderBy(sortOrder === "desc" ? desc(sortField) : asc(sortField))
          .limit(limit)
          .offset(offset);

    return { items, total };
  }

  /**
   * ID로 레시피 조회
   */
  async findById(id: string): Promise<RecipeWithIngredients | null> {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
    });

    if (!recipe) return null;

    const ingredientsList = await db
      .select({
        id: ingredients.id,
        name: ingredients.name,
        quantity: recipeIngredients.quantity,
        unit: recipeIngredients.unit,
        costForThisRecipe: recipeIngredients.costForThisRecipe,
      })
      .from(recipeIngredients)
      .innerJoin(
        ingredients,
        eq(recipeIngredients.ingredientId, ingredients.id)
      )
      .where(eq(recipeIngredients.recipeId, id));

    return {
      ...recipe,
      ingredientsList,
    };
  }

  /**
   * 레시피 생성
   */
  async create(input: CreateRecipeInput): Promise<typeof recipes.$inferSelect> {
    const id = randomUUID();
    const created = await db
      .insert(recipes)
      .values({
        id,
        ...input,
      })
      .returning();

    return created[0];
  }

  /**
   * 레시피 업데이트
   */
  async update(
    id: string,
    input: UpdateRecipeInput
  ): Promise<typeof recipes.$inferSelect> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("레시피", id);
    }

    const updated = await db
      .update(recipes)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    return updated[0];
  }

  /**
   * 레시피 삭제
   */
  async delete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("레시피", id);
    }

    await db.delete(recipes).where(eq(recipes.id, id));
  }

  /**
   * 통계 조회
   */
  async getStatistics(): Promise<{
    averageCost: number;
    averageSoldPrice: number;
    averageMargin: number;
    totalRecipes: number;
  }> {
    try {
      const allRecipes = await db.select().from(recipes);

      if (allRecipes.length === 0) {
        return {
          averageCost: 0,
          averageSoldPrice: 0,
          averageMargin: 0,
          totalRecipes: 0,
        };
      }

      const totalCost = allRecipes.reduce((sum, r) => sum + (r.totalCostWon || 0), 0);
      const totalSoldPrice = allRecipes.reduce(
        (sum, r) => sum + (r.soldPrice || 0),
        0
      );
      const totalMargin = allRecipes.reduce((sum, r) => sum + (r.margin || 0), 0);

      return {
        averageCost: Math.round((totalCost / allRecipes.length) * 100) / 100,
        averageSoldPrice:
          Math.round((totalSoldPrice / allRecipes.length) * 100) / 100,
        averageMargin: Math.round((totalMargin / allRecipes.length) * 100) / 100,
        totalRecipes: allRecipes.length,
      };
    } catch (error) {
      console.error("통계 조회 오류:", error);
      return {
        averageCost: 0,
        averageSoldPrice: 0,
        averageMargin: 0,
        totalRecipes: 0,
      };
    }
  }
}

export const recipeRepository = new RecipeRepository();
