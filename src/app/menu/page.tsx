import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import MenuExperience from "@/components/menu-experience/MenuExperience";
import LenisProvider from "@/components/menu-experience/LenisProvider";
import { getProducts, getCategories } from "@/lib/api/products";
import { groupProductsByFamily } from "@/lib/menu/families";

export const revalidate = 60;

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts({ revalidate: 60 }),
    getCategories({ revalidate: 300 }),
  ]);

  const families = groupProductsByFamily(products, categories);

  return (
    <LenisProvider>
      <Header />
      <main>
        <MenuExperience families={families} />
      </main>
      <Footer />
    </LenisProvider>
  );
}
