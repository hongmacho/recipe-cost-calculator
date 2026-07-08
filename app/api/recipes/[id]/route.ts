import { recipeRepository } from "@/lib/repositories/recipe.repository";
import { createErrorResponse } from "@/lib/utils/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await recipeRepository.findById(id);

    if (!recipe) {
      return Response.json(
        { success: false, error: "레시피를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: recipe });
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await recipeRepository.update(id, body);

    return Response.json({ success: true, data: updated });
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await recipeRepository.delete(id);

    return Response.json({ success: true, data: null });
  } catch (error) {
    return Response.json(createErrorResponse(error), { status: 400 });
  }
}
