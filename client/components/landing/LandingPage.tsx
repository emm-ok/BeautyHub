import Hero from "./Hero";
import TrustBar from "./TrustBar";
import FeaturedCategories from "./FeaturedCategories";
import WhyBeautyHub from "./WhyBeautyHub";
import HowItWorks from "./HowItWorks";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <Hero />

      <TrustBar />

      <FeaturedCategories />

      <WhyBeautyHub />

      <HowItWorks />
    </main>
  );
}