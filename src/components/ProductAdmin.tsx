"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductSpecification } from "@/types/product";

type ProductAdminProps = {
  initialProducts: Product[];
};

type ProductForm = Omit<Product, "id" | "slug" | "specifications" | "applications"> & {
  specificationsText: string;
  applicationsText: string;
};

const emptyForm: ProductForm = {
  sku: "",
  name: "",
  manufacturer: "",
  category: "",
  unit: "UN",
  shortDescription: "",
  description: "",
  imageUrl: "",
  featured: false,
  specificationsText: "",
  applicationsText: ""
};

function productToForm(product: Product): ProductForm {
  return {
    sku: product.sku,
    name: product.name,
    manufacturer: product.manufacturer,
    category: product.category,
    unit: product.unit,
    shortDescription: product.shortDescription,
    description: product.description,
    imageUrl: product.imageUrl,
    featured: product.featured,
    specificationsText: product.specifications
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n"),
    applicationsText: product.applications.join("\n")
  };
}

function parseSpecifications(value: string): ProductSpecification[] {
  return value
    .split("\n")
    .map((line) => {
      const separator = line.indexOf(":");

      if (separator === -1) {
        return { label: line.trim(), value: "" };
      }

      return {
        label: line.slice(0, separator).trim(),
        value: line.slice(separator + 1).trim()
      };
    })
    .filter((item) => item.label && item.value);
}

export function ProductAdmin({ initialProducts }: ProductAdminProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setForm(productToForm(product));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      specifications: parseSpecifications(form.specificationsText),
      applications: form.applicationsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    const endpoint = editingId
      ? `/api/products/${editingId}`
      : "/api/products";
    const response = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.message || "Não foi possível salvar o produto.");
      return;
    }

    if (editingId) {
      setProducts((current) =>
        current.map((product) => (product.id === editingId ? result : product))
      );
      setMessage("Produto atualizado com sucesso.");
    } else {
      setProducts((current) => [...current, result]);
      setMessage("Produto cadastrado com sucesso.");
    }

    resetForm();
    router.refresh();
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Remover "${product.name}" da vitrine?`)) {
      return;
    }

    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.message || "Não foi possível remover o produto.");
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );
    setMessage("Produto removido da vitrine.");

    if (editingId === product.id) {
      resetForm();
    }

    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/lojista/login");
    router.refresh();
  }

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">Área do lojista</span>
          <h1>Produtos da vitrine</h1>
          <p>Olá Bruno, cadastre, edite ou remova produtos do seu estoque.</p>
        </div>
        <button className="button secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <section className="admin-form-card">
        <h2>{editingId ? "Editar produto" : "Cadastrar novo produto"}</h2>

        <form className="admin-product-form" onSubmit={handleSubmit}>
          <label>
            Código SKU *
            <input
              value={form.sku}
              onChange={(event) => updateField("sku", event.target.value)}
              required
            />
          </label>

          <label>
            Produto *
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </label>

          <label>
            Fabricante *
            <input
              value={form.manufacturer}
              onChange={(event) =>
                updateField("manufacturer", event.target.value)
              }

              required
            />
          </label>

          <label>
            Categoria *
            <input
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              required
            />
          </label>

          <label>
            Unidade
            <input
              value={form.unit}
              onChange={(event) => updateField("unit", event.target.value)}
              placeholder="UN"
            />
          </label>

          <label className="wide-field">
            URL da imagem *
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          <label className="wide-field">
            Descrição curta
            <input
              value={form.shortDescription}
              onChange={(event) =>
                updateField("shortDescription", event.target.value)
              }
              placeholder="Texto exibido no card"
            />
          </label>

          <label className="wide-field">
            Descrição completa *
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
            />
          </label>

          <label>
            Especificações
            <textarea
              rows={5}
              value={form.specificationsText}
              onChange={(event) =>
                updateField("specificationsText", event.target.value)
              }
              placeholder={"Uma por linha:\nMemória Interna:\nTamanho de Tela:\nCâmera traseira"}
            />
          </label>

          <label>
            Aplicações
            <textarea
              rows={5}
              value={form.applicationsText}
              onChange={(event) =>
                updateField("applicationsText", event.target.value)
              }
              placeholder={"Uma por linha:\nVenda de eletrônicos"}
            />
          </label>

          <label className="checkbox-field wide-field">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
            />
            Exibir como produto em destaque
          </label>

          {error && <p className="form-error wide-field">{error}</p>}
          {message && <p className="form-success wide-field">{message}</p>}

          <div className="admin-form-actions wide-field">
            <button className="button primary large" disabled={loading}>
              {loading
                ? "Salvando..."
                : editingId
                  ? "Salvar alterações"
                  : "Cadastrar produto"}
            </button>
            {editingId && (
              <button
                type="button"
                className="button secondary large"
                onClick={resetForm}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cadastrados</span>
            <h2>{products.length} produto(s)</h2>
          </div>
        </div>

        {products.map((product) => (
          <article className="admin-product-row" key={product.id}>
            <img src={product.imageUrl} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span>
                {product.sku} · {product.manufacturer} · {product.category}
              </span>
            </div>
            <div className="admin-row-actions">
              <button
                className="button secondary"
                onClick={() => startEditing(product)}
              >
                Editar
              </button>
              <button
                className="button danger"
                onClick={() => handleDelete(product)}
              >
                Remover
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
