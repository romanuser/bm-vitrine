import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container section empty-state">
      <h1>Produto não encontrado</h1>
      <p>O item informado não existe ou não está mais disponível.</p>
      <Link href="/catalogo" className="button primary">
        Voltar ao catálogo
      </Link>
    </section>
  );
}
