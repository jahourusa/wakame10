import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ServiceMarquee } from "@/components/sections/ServiceMarquee";
import { Categories } from "@/components/sections/Categories";
import { BestSellers } from "@/components/sections/BestSellers";
import { About } from "@/components/sections/About";
import { SignaturePromo } from "@/components/sections/SignaturePromo";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonial } from "@/components/sections/Testimonial";
import { InstagramGrid } from "@/components/sections/InstagramGrid";
import { Newsletter } from "@/components/sections/Newsletter";
import { getProducts } from "@/lib/api/products";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts({ revalidate: 60 });

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServiceMarquee />
        <Categories />
        <BestSellers products={products} />
        <About />
        <SignaturePromo />
        <WhyChooseUs />
        <Testimonial />
        <section
          id="contact"
          className="theater-surface relative overflow-hidden py-32 md:py-40"
        >
          <div className="gold-thread absolute left-1/2 top-0 w-1/2 -translate-x-1/2" />
          <InstagramGrid />
          <div className="px-6 md:px-12">
            <Newsletter />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
