import WhyChooseUs from "@/components/ChooseUs";
import CoursesGrid from "@/components/CoursesGrid";
import FAQ from "@/components/FAQ";

import HeroSection from "@/components/hero/HeroSection";

import PricingPlans from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px]">
      <HeroSection />
      <CoursesGrid />
      <WhyChooseUs />
      <PricingPlans />
      <Testimonials />
      <FAQ />
    </main>
  );
}
