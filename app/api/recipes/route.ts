import { recipeRepository } from "@/lib/repositories/recipe.repository";
import { createErrorResponse } from "@/lib/utils/errors";

export async function GET(request: Request) {
  try {
    const result = await recipeRepository.findAll({ limit: 999 });
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
    const created = await recipeRepository.create(body);
    return Response.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 400 });
  }
}
