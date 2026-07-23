"use client";

import { FormEvent, useState } from "react";
import type { Product } from "@/types/product";

type InterestFormProps = {
  product: Product;
};

type FormData = {
  name: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
};

const initialForm: FormData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  notes: ""
};

export function InterestForm({ product }: InterestFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState("");

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.email || !form.company) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const whatsappNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5527997840166";

    const message = [
      "Olá, equipe da B&M Distribuidora!",
      "",
      "Tenho interesse no produto:",
      `Produto: ${product.name}`,
      `SKU: ${product.sku}`,
      `Fabricante: ${product.manufacturer}`,
      `Unidade: ${product.unit}`,
      "",
      "Dados para contato:",
      `Nome: ${form.name}`,
      `Empresa: ${form.company}`,
      `Telefone: ${form.phone}`,
      `E-mail: ${form.email}`,
      "",
      `Observações: ${form.notes || "Sem observações."}`
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.location.href = url;
  }

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div className="selected-product">
        <span>Produto selecionado</span>
        <strong>{product.name}</strong>
        <small>SKU: {product.sku}</small>
      </div>

      <div className="form-grid">
        <label>
          Nome *
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
          />
        </label>

        <label>
          Telefone de contato *
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
          />
        </label>

        <label>
          E-mail *
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Empresa *
          <input
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            autoComplete="organization"
          />
        </label>

        <label className="full-width">
          Observações
          <textarea
            rows={5}
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Informe modelo do veículo, ano, quantidade ou outras informações."
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="button primary large">
        Enviar informações pelo WhatsApp
      </button>
    </form>
  );
}
