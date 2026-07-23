import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/product-store";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="container section">
      <div className="product-detail">
        <div className="product-detail-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-content">
          <span className="product-brand">{product.manufacturer}</span>
          <h1>{product.name}</h1>
          <p className="sku">SKU: {product.sku}</p>
          <p>{product.description}</p>

          <dl className="specification-list">
            {product.specifications.map((specification) => (
              <div key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value}</dd>
              </div>
            ))}
          </dl>

          <div className="applications">
            <h2>Aplicações</h2>
            <ul>
              {product.applications.map((application) => (
                <li key={application}>{application}</li>
              ))}
            </ul>
          </div>

          <Link
            href={`/atendimento/${product.slug}`}
            className="button primary large"
          >
            Adquirir produto
          </Link>
        </div>
      </div>
    </section>
  );
}
