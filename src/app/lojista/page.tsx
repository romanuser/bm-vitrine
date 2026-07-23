import { redirect } from "next/navigation";
import { ProductAdmin } from "@/components/ProductAdmin";
import { isAuthenticated } from "@/lib/auth";
import { getProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function MerchantPage() {
  if (!(await isAuthenticated())) {
    redirect("/lojista/login");
  }

  const products = await getProducts();

  return (
    <section className="container section admin-page">
      <ProductAdmin initialProducts={products} />
    </section>
  );
}
