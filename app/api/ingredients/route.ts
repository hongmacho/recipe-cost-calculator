import { ingredientRepository } from "@/lib/repositories/ingredient.repository";
import { createErrorResponse } from "@/lib/utils/errors";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const category = url.searchParams.get("category") || undefined;

    const result = await ingredientRepository.findAll({
      search: search || undefined,
      category: category || undefined,
      limit: 999,
    });

    return Response.json({
      success: true,
      data: result.items,
      meta: { total: result.total },
    });
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await ingredientRepository.create(body);

    return Response.json(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 400 });
  }
}
