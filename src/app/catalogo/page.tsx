import { ProductCatalog } from "@/components/ProductCatalog";
import { getProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <section className="container section">
      <div className="page-heading">
        <span className="eyebrow">Vitrine</span>
        <h1>Catálogo de produtos</h1>
        <p>
          Pesquise por produto, SKU, fabricante ou categoria.
        </p>
      </div>

      <ProductCatalog products={products} />
    </section>
  );
}
