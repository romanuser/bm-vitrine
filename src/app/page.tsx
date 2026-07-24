import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="eyebrow">Catálogo B2B</span>
            <h1>A importadora que irá lhe atender com muita satisfação.</h1>
            <p>
              Consulte produtos eletrônicos em nosso estoque e fale diretamente com
              o time comercial da B&M Importadora e Distribuidora.
            </p>
            <Link href="/catalogo" className="button primary large">
              Ver catálogo
            </Link>
          </div>

          <div className="hero-panel">
            <strong>Atendimento personalizado</strong>
            <p>
              Escolha o produto, preencha seus dados e envie a solicitação
              diretamente pelo WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Destaques</span>
            <h2>Produtos em evidência</h2>
          </div>
          <Link href="/catalogo">Ver todos</Link>
        </div>

        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits-grid">
          <article>
            <strong>Catálogo especializado</strong>
            <p>Produtos organizados por fabricante, categoria e códigos de fabricante.</p>
          </article>
          <article>
            <strong>Consulte os melhores valores do mercado</strong>
            <p>As condições comerciais são tratadas diretamente no atendimento.</p>
          </article>
          <article>
            <strong>Contato rápido</strong>
            <p>O formulário gera uma mensagem pronta para o WhatsApp.</p>
          </article>
        </div>
      </section>
    </>
  );
}
