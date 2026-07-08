#!/usr/bin/env node

/**
 * Initialize database by creating tables
 */

import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./recipe-cost-calculator.db";
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

console.log("🔧 Initializing database...");

try {
  // Create ingredients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      unit_price REAL NOT NULL,
      unit TEXT NOT NULL,
      supplier TEXT,
      supplier_phone TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create recipes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      total_cost_won REAL DEFAULT 0,
      sold_price REAL,
      margin REAL,
      markup REAL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create recipe_ingredients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL,
      ingredient_id TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      cost_for_this_recipe REAL NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY(ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
    )
  `);

  // Create ingredient_price_history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredient_price_history (
      id TEXT PRIMARY KEY,
      ingredient_id TEXT NOT NULL,
      old_price REAL NOT NULL,
      new_price REAL NOT NULL,
      changed_at INTEGER NOT NULL,
      FOREIGN KEY(ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Database initialized successfully");
} catch (error) {
  console.error("❌ Database initialization failed:", error);
  process.exit(1);
} finally {
  db.close();
}
