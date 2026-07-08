/**
 * 애플리케이션 에러 클래스
 * 모든 에러를 일관되게 처리합니다.
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * 유효성 검사 에러
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
    this.name = "ValidationError";
  }
}

/**
 * 리소스를 찾을 수 없는 에러
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(
      "NOT_FOUND",
      `${resource}를 찾을 수 없습니다: ${id}`,
      404
    );
    this.name = "NotFoundError";
  }
}

/**
 * 이미 존재하는 리소스 에러
 */
export class AlreadyExistsError extends AppError {
  constructor(resource: string, field: string, value: string) {
    super(
      "ALREADY_EXISTS",
      `${resource}의 ${field}가 이미 존재합니다: ${value}`,
      409
    );
    this.name = "AlreadyExistsError";
  }
}

/**
 * 데이터베이스 에러
 */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super("DATABASE_ERROR", message, 500);
    this.name = "DatabaseError";
  }
}

/**
 * 에러 메시지 추출
 * unknown 타입의 에러를 안전하게 처리합니다.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "알 수 없는 오류가 발생했습니다";
}

/**
 * API 응답 포맷팅
 */
export function createErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  return {
    success: false,
    error: getErrorMessage(error),
    code: "INTERNAL_ERROR",
  };
}
