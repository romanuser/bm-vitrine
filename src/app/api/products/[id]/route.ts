import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { normalizeProduct, validateProduct } from "@/lib/product-input";
import { deleteProduct, updateProduct } from "@/lib/product-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const product = normalizeProduct(await request.json());
    const validationError = validateProduct(product);

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    const updated = await updateProduct(Number(id), product);

    if (!updated) {
      return NextResponse.json(
        { message: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível editar o produto."
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deleteProduct(Number(id));

  if (!removed) {
    return NextResponse.json(
      { message: "Produto não encontrado." },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
