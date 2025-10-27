import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center gap-4">
        <HeroSection />
        <CourseCard />
      </main>
      <Footer />
    </>
  );
}
