#!/usr/bin/env node

/**
 * Seed script for recipe-cost-calculator
 * Creates sample ingredients, recipes, and recipe-ingredient connections
 */

import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const dbPath = process.env.DATABASE_PATH || "./recipe-cost-calculator.db";
const db = new Database(dbPath);

// Enable WAL mode
db.pragma("journal_mode = WAL");

// Sample ingredients data
const ingredientsData = [
  { name: "쌀", category: "곡류", unitPrice: 4000, unit: "kg", supplier: "농협", supplierPhone: "02-1234-5678" },
  { name: "밀가루", category: "곡류", unitPrice: 3500, unit: "kg", supplier: "마리골드", supplierPhone: "02-9876-5432" },
  { name: "설탕", category: "양념", unitPrice: 2500, unit: "kg" },
  { name: "소금", category: "양념", unitPrice: 1200, unit: "kg" },
  { name: "우유", category: "유제품", unitPrice: 5000, unit: "l", supplier: "남양", supplierPhone: "02-5555-5555" },
  { name: "계란", category: "육류", unitPrice: 8000, unit: "판", supplier: "대원", supplierPhone: "02-7777-7777" },
  { name: "버터", category: "유제품", unitPrice: 12000, unit: "kg" },
  { name: "올리브유", category: "오일", unitPrice: 18000, unit: "l" },
  { name: "토마토소스", category: "양념", unitPrice: 6000, unit: "kg" },
  { name: "치즈", category: "유제품", unitPrice: 15000, unit: "kg", supplier: "매지", supplierPhone: "02-3333-3333" },
  { name: "바나나", category: "과일", unitPrice: 3000, unit: "kg" },
  { name: "딸기", category: "과일", unitPrice: 8000, unit: "kg" },
];

// Sample recipes data
const recipesData = [
  { name: "바나나 요거트 스무디", category: "음료", soldPrice: 8000 },
  { name: "딸기 치즈케이크", category: "베이커리", soldPrice: 15000 },
  { name: "우유 쿠키", category: "베이커리", soldPrice: 6000 },
  { name: "토마토 파스타", category: "요리", soldPrice: 12000 },
  { name: "치즈 계란 오믈렛", category: "요리", soldPrice: 9000 },
  { name: "올리브 브레드", category: "베이커리", soldPrice: 7000 },
];

// Recipe ingredients connections
const recipeIngredientsData = [
  // 바나나 요거트 스무디: 바나나(500g), 우유(200ml), 설탕(30g)
  { recipeIndex: 0, ingredientIndex: 10, quantity: 0.5, unit: "kg" },
  { recipeIndex: 0, ingredientIndex: 4, quantity: 0.2, unit: "l" },
  { recipeIndex: 0, ingredientIndex: 2, quantity: 0.03, unit: "kg" },

  // 딸기 치즈케이크: 딸기(300g), 치즈(400g), 밀가루(200g), 계란(2판), 버터(100g)
  { recipeIndex: 1, ingredientIndex: 11, quantity: 0.3, unit: "kg" },
  { recipeIndex: 1, ingredientIndex: 9, quantity: 0.4, unit: "kg" },
  { recipeIndex: 1, ingredientIndex: 1, quantity: 0.2, unit: "kg" },
  { recipeIndex: 1, ingredientIndex: 5, quantity: 2, unit: "판" },
  { recipeIndex: 1, ingredientIndex: 6, quantity: 0.1, unit: "kg" },

  // 우유 쿠키: 우유(100ml), 밀가루(150g), 설탕(80g), 버터(60g), 계란(1판)
  { recipeIndex: 2, ingredientIndex: 4, quantity: 0.1, unit: "l" },
  { recipeIndex: 2, ingredientIndex: 1, quantity: 0.15, unit: "kg" },
  { recipeIndex: 2, ingredientIndex: 2, quantity: 0.08, unit: "kg" },
  { recipeIndex: 2, ingredientIndex: 6, quantity: 0.06, unit: "kg" },
  { recipeIndex: 2, ingredientIndex: 5, quantity: 1, unit: "판" },

  // 토마토 파스타: 밀가루(200g), 토마토소스(300g), 올리브유(30ml), 치즈(50g), 소금(5g)
  { recipeIndex: 3, ingredientIndex: 1, quantity: 0.2, unit: "kg" },
  { recipeIndex: 3, ingredientIndex: 8, quantity: 0.3, unit: "kg" },
  { recipeIndex: 3, ingredientIndex: 7, quantity: 0.03, unit: "l" },
  { recipeIndex: 3, ingredientIndex: 9, quantity: 0.05, unit: "kg" },
  { recipeIndex: 3, ingredientIndex: 3, quantity: 0.005, unit: "kg" },

  // 치즈 계란 오믈렛: 계란(2판), 치즈(100g), 버터(20g), 소금(2g)
  { recipeIndex: 4, ingredientIndex: 5, quantity: 2, unit: "판" },
  { recipeIndex: 4, ingredientIndex: 9, quantity: 0.1, unit: "kg" },
  { recipeIndex: 4, ingredientIndex: 6, quantity: 0.02, unit: "kg" },
  { recipeIndex: 4, ingredientIndex: 3, quantity: 0.002, unit: "kg" },

  // 올리브 브레드: 밀가루(300g), 올리브유(50ml), 계란(1판), 소금(8g), 설탕(20g)
  { recipeIndex: 5, ingredientIndex: 1, quantity: 0.3, unit: "kg" },
  { recipeIndex: 5, ingredientIndex: 7, quantity: 0.05, unit: "l" },
  { recipeIndex: 5, ingredientIndex: 5, quantity: 1, unit: "판" },
  { recipeIndex: 5, ingredientIndex: 3, quantity: 0.008, unit: "kg" },
  { recipeIndex: 5, ingredientIndex: 2, quantity: 0.02, unit: "kg" },
];

console.log("🌱 Seeding database...");
console.log(`📁 Database path: ${dbPath}`);

try {
  // 1. Insert ingredients
  console.log("\n📦 Inserting ingredients...");
  const ingredientIds = [];
  for (const ing of ingredientsData) {
    const id = randomUUID();
    ingredientIds.push(id);
    const now = Math.floor(Date.now() / 1000);
    db.exec(`
      INSERT INTO ingredients (id, name, category, unit_price, unit, supplier, supplier_phone, created_at, updated_at)
      VALUES ('${id}', '${ing.name}', '${ing.category}', ${ing.unitPrice}, '${ing.unit}', ${ing.supplier ? `'${ing.supplier}'` : 'NULL'}, ${ing.supplierPhone ? `'${ing.supplierPhone}'` : 'NULL'}, ${now}, ${now})
    `);
  }
  console.log(`✅ Inserted ${ingredientIds.length} ingredients`);

  // 2. Insert recipes
  console.log("\n🍳 Inserting recipes...");
  const recipeIds = [];
  for (const recipe of recipesData) {
    const id = randomUUID();
    recipeIds.push(id);
    const now = Math.floor(Date.now() / 1000);
    db.exec(`
      INSERT INTO recipes (id, name, category, total_cost_won, sold_price, margin, markup, created_at, updated_at)
      VALUES ('${id}', '${recipe.name}', '${recipe.category}', 0, ${recipe.soldPrice || 0}, 0, 0, ${now}, ${now})
    `);
  }
  console.log(`✅ Inserted ${recipeIds.length} recipes`);

  // 3. Insert recipe ingredients and calculate costs
  console.log("\n🔗 Inserting recipe ingredients...");
  for (const conn of recipeIngredientsData) {
    const id = randomUUID();
    const ingredientId = ingredientIds[conn.ingredientIndex];
    const recipeId = recipeIds[conn.recipeIndex];

    // Get ingredient price
    const ingredient = ingredientsData[conn.ingredientIndex];
    const costForThisRecipe = ingredient.unitPrice * conn.quantity;
    const now = Math.floor(Date.now() / 1000);

    db.exec(`
      INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity, unit, cost_for_this_recipe, created_at)
      VALUES ('${id}', '${recipeId}', '${ingredientId}', ${conn.quantity}, '${conn.unit}', ${costForThisRecipe}, ${now})
    `);
  }
  console.log(`✅ Inserted ${recipeIngredientsData.length} recipe ingredient connections`);

  // 4. Update recipe total costs
  console.log("\n💰 Calculating total recipe costs...");
  for (let i = 0; i < recipeIds.length; i++) {
    const recipeId = recipeIds[i];
    const result = db.prepare(`
      SELECT SUM(cost_for_this_recipe) as total_cost FROM recipe_ingredients WHERE recipe_id = ?
    `).get(recipeId);

    const totalCost = result?.total_cost || 0;
    const recipe = recipesData[i];
    const margin = recipe.soldPrice ? ((recipe.soldPrice - totalCost) / recipe.soldPrice) * 100 : 0;
    const markup = totalCost > 0 ? ((recipe.soldPrice - totalCost) / totalCost) * 100 : 0;

    db.exec(`
      UPDATE recipes SET total_cost_won = ${totalCost}, margin = ${margin}, markup = ${markup} WHERE id = '${recipeId}'
    `);
  }
  console.log(`✅ Updated recipe costs and margins`);

  // 5. Verify data
  console.log("\n✨ Verifying data...");
  const ingredientCount = db.prepare("SELECT COUNT(*) as count FROM ingredients").get().count;
  const recipeCount = db.prepare("SELECT COUNT(*) as count FROM recipes").get().count;
  const recipeIngredientCount = db.prepare("SELECT COUNT(*) as count FROM recipe_ingredients").get().count;

  console.log(`   Ingredients: ${ingredientCount}`);
  console.log(`   Recipes: ${recipeCount}`);
  console.log(`   Recipe Ingredients: ${recipeIngredientCount}`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log({
    seed: {
      ok: true,
      counts: {
        ingredients: ingredientCount,
        recipes: recipeCount,
        recipeIngredients: recipeIngredientCount,
      },
    },
  });
} catch (error) {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
} finally {
  db.close();
}
