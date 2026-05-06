import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCustomizer } from "@/components/sections/ProductCustomizer";
import { getProductBySlug } from "@/lib/api/products";

interface Params {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, { revalidate: 60 });

  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="pt-32 pb-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <ProductCustomizer product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
