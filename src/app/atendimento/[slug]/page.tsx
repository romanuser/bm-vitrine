import { notFound } from "next/navigation";
import { InterestForm } from "@/components/InterestForm";
import { getProductBySlug } from "@/lib/product-store";

type InterestPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterestPage({ params }: InterestPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="container section narrow">
      <div className="page-heading">
        <span className="eyebrow">Atendimento</span>
        <h1>Solicitar produto</h1>
        <p>
          Preencha seus dados. Ao finalizar, você será direcionado ao WhatsApp
          da B&M Distribuidora.
        </p>
      </div>

      <InterestForm product={product} />
    </section>
  );
}
