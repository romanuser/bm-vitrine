import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link href={`/produto/${product.slug}`} className="product-image-link">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-card-body">
        <span className="product-brand">{product.manufacturer}</span>
        <h2>{product.name}</h2>
        <p className="sku">SKU: {product.sku}</p>
        <p>{product.shortDescription}</p>

        <div className="product-card-actions">
          <Link href={`/produto/${product.slug}`} className="button secondary">
            Ver detalhes
          </Link>
          <Link href={`/atendimento/${product.slug}`} className="button primary">
            Adquirir produto
          </Link>
        </div>
      </div>
    </article>
  );
}
