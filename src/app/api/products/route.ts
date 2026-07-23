import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { normalizeProduct, validateProduct } from "@/lib/product-input";
import { createProduct, getProducts } from "@/lib/product-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();

  return NextResponse.json({
    products,
    total: products.length
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const product = normalizeProduct(await request.json());
    const validationError = validateProduct(product);

    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 }
      );
    }

    return NextResponse.json(await createProduct(product), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível cadastrar o produto."
      },
      { status: 400 }
    );
  }
}
