"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

type ProductCatalogProps = {
  products: Product[];
};

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("Todos");
  const [category, setCategory] = useState("Todas");

  const manufacturers = useMemo(
    () => ["Todos", ...Array.from(new Set(products.map((p) => p.manufacturer)))],
    [products]
  );

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery) ||
        product.manufacturer.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      const matchesManufacturer =
        manufacturer === "Todos" || product.manufacturer === manufacturer;

      const matchesCategory =
        category === "Todas" || product.category === category;

      return matchesQuery && matchesManufacturer && matchesCategory;
    });
  }, [products, query, manufacturer, category]);

  return (
    <>
      <section className="catalog-filters" aria-label="Filtros do catálogo">
        <input
          type="search"
          placeholder="Buscar por produto, SKU, marca ou categoria"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          value={manufacturer}
          onChange={(event) => setManufacturer(event.target.value)}
          aria-label="Filtrar por fabricante"
        >
          {manufacturers.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filtrar por categoria"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      <p className="result-count">
        {filteredProducts.length} produto(s) encontrado(s)
      </p>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          Nenhum produto encontrado com os filtros informados.
        </div>
      )}
    </>
  );
}
