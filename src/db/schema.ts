import {
  sqliteTable,
  text,
  real,
  integer,
} from "drizzle-orm/sqlite-core";

/**
 * 재료 테이블
 * 각 재료의 기본 정보 (이름, 단가, 단위, 카테고리)를 저장합니다.
 */
export const ingredients = sqliteTable("ingredients", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // 곡류, 육류, 유제품, 향신료 등
  unitPrice: real("unit_price").notNull(), // 원 단위
  unit: text("unit").notNull(), // kg, g, 개, 병, 팩 등
  supplier: text("supplier"),
  supplierPhone: text("supplier_phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * 레시피 테이블
 * 각 레시피의 기본 정보와 계산된 원가, 판매가, 수익율을 저장합니다.
 */
export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"), // 음료, 베이커리, 도시락 등
  totalCostWon: real("total_cost_won").default(0), // 총 원가 (원)
  soldPrice: real("sold_price"), // 판매가 (원, 선택사항)
  margin: real("margin"), // 수익율 (%), 계산값
  markup: real("markup"), // 마진율 (%), 계산값
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * 레시피-재료 연결 테이블
 * 각 레시피가 사용하는 재료와 수량을 저장합니다.
 */
export const recipeIngredients = sqliteTable("recipe_ingredients", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  quantity: real("quantity").notNull(), // 수량
  unit: text("unit").notNull(), // 해당 재료의 단위 (kg, g, 개 등)
  costForThisRecipe: real("cost_for_this_recipe").notNull(), // 이 재료의 원가 (원)
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

/**
 * 재료비 변동 이력 테이블
 * 재료의 단가가 변경될 때마다 기록합니다.
 * 이를 통해 "지난달 vs 이번달" 비교가 가능합니다.
 */
export const ingredientPriceHistory = sqliteTable("ingredient_price_history", {
  id: text("id").primaryKey(),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  oldPrice: real("old_price").notNull(),
  newPrice: real("new_price").notNull(),
  changedAt: integer("changed_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// 타입 내보내기
export type Ingredient = typeof ingredients.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type IngredientPriceHistory = typeof ingredientPriceHistory.$inferSelect;
