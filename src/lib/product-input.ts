import type { Product } from "@/types/product";

export function normalizeProduct(
  body: Partial<Product>
): Omit<Product, "id" | "slug"> {
  return {
    sku: String(body.sku || "").trim().toUpperCase(),
    name: String(body.name || "").trim(),
    manufacturer: String(body.manufacturer || "").trim(),
    category: String(body.category || "").trim(),
    unit: String(body.unit || "UN").trim().toUpperCase(),
    shortDescription: String(body.shortDescription || "").trim(),
    description: String(body.description || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
    featured: Boolean(body.featured),
    specifications: Array.isArray(body.specifications)
      ? body.specifications
          .map((item) => ({
            label: String(item.label || "").trim(),
            value: String(item.value || "").trim()
          }))
          .filter((item) => item.label && item.value)
      : [],
    applications: Array.isArray(body.applications)
      ? body.applications.map(String).map((item) => item.trim()).filter(Boolean)
      : []
  };
}

export function validateProduct(product: Omit<Product, "id" | "slug">) {
  if (
    !product.sku ||
    !product.name ||
    !product.manufacturer ||
    !product.category ||
    !product.description ||
    !product.imageUrl
  ) {
    return "Preencha SKU, produto, fabricante, categoria, descrição e imagem.";
  }
}
