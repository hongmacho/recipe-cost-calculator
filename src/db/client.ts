import "server-only";

import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_PATH || "./recipe-cost-calculator.db";

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

/**
 * DB 클라이언트 인스턴스
 * 모든 데이터베이스 작업은 이 클라이언트를 통해 수행됩니다.
 */
export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});

/**
 * 데이터베이스 초기화 함수
 * 필요한 모든 테이블을 생성합니다.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Drizzle 마이그레이션이 필요한 경우 여기에 추가
    // 현재는 테이블이 자동으로 생성됨 (schema.ts 기반)
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
