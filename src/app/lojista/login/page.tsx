import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export default async function MerchantLoginPage() {
  if (await isAuthenticated()) {
    redirect("/lojista");
  }

  return (
    <section className="container section login-section">
      <div className="page-heading">
        <span className="eyebrow">Acesso restrito</span>
        <h1>Área do lojista</h1>
        <p>Entre para cadastrar e administrar os produtos da vitrine.</p>
      </div>
      <LoginForm />
    </section>
  );
}
