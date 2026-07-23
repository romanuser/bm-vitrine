import { promises as fs } from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import initialProducts from "../../data/products.json";
import type { Product } from "@/types/product";

const databasePath = path.join(process.cwd(), "data", "products.json");
const blobStoreName = "bm-vitrine";
const blobKey = "products";

function isRunningOnNetlify() {
  return Boolean(
    process.env.NETLIFY === "true" ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

async function getLocalProducts(): Promise<Product[]> {
  const content = await fs.readFile(databasePath, "utf8");
  return JSON.parse(content) as Product[];
}

function getInitialProducts(): Product[] {
  return structuredClone(initialProducts) as Product[];
}

export function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getProducts(): Promise<Product[]> {
  if (!isRunningOnNetlify()) {
    return getLocalProducts();
  }

  const store = getStore({
    name: blobStoreName,
    consistency: "strong"
  });
  const savedProducts = (await store.get(blobKey, {
    type: "json",
    consistency: "strong"
  })) as Product[] | null;

  return savedProducts ?? getInitialProducts();
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

async function saveProducts(products: Product[]) {
  if (isRunningOnNetlify()) {
    const store = getStore({
      name: blobStoreName,
      consistency: "strong"
    });
    await store.setJSON(blobKey, products);
    return;
  }

  const temporaryPath = `${databasePath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(products, null, 2), "utf8");
  await fs.rename(temporaryPath, databasePath);
}

export async function createProduct(
  input: Omit<Product, "id" | "slug">
): Promise<Product> {
  const products = await getProducts();

  if (products.some((product) => product.sku === input.sku)) {
    throw new Error("Já existe um produto com este SKU.");
  }

  const baseSlug = createSlug(input.name);
  let slug = baseSlug;
  let suffix = 2;

  while (products.some((product) => product.slug === slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const product: Product = {
    ...input,
    id: products.reduce((highest, item) => Math.max(highest, item.id), 0) + 1,
    slug
  };

  await saveProducts([...products, product]);
  return product;
}

export async function updateProduct(
  id: number,
  input: Omit<Product, "id" | "slug">
) {
  const products = await getProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return undefined;
  }

  if (
    products.some((product) => product.id !== id && product.sku === input.sku)
  ) {
    throw new Error("Já existe outro produto com este SKU.");
  }

  const baseSlug =
    products[index].name === input.name
      ? products[index].slug
      : createSlug(input.name);
  let slug = baseSlug;
  let suffix = 2;

  while (
    products.some((product) => product.id !== id && product.slug === slug)
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const updated: Product = {
    ...input,
    id,
    slug
  };

  products[index] = updated;
  await saveProducts(products);
  return updated;
}

export async function deleteProduct(id: number) {
  const products = await getProducts();
  const remaining = products.filter((product) => product.id !== id);

  if (remaining.length === products.length) {
    return false;
  }

  await saveProducts(remaining);
  return true;
}
