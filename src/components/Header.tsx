import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link href="/" className="brand">
          <span className="brand-mark">B&M</span>
          <span>
            <strong>Importadora e Distribuidora.</strong>
            <small>Produtos de importação</small>
          </span>
        </Link>

        <nav className="navigation" aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/lojista">Área Lojista</Link>
        </nav>
      </div>
    </header>
  );
}
