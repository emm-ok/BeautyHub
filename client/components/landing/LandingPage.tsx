import Hero from "./Hero";
import TrustBar from "./TrustBar";
import FeaturedCategories from "./FeaturedCategories";
import WhyBeautyHub from "./WhyBeautyHub";
import HowItWorks from "./HowItWorks";
import FeaturedProducts from "./FeaturedProducts";
import ProductEducation from "./ProductEducation";
import VerifiedShopping from "./VerifiedShopping";
import DeliveryCoverage from "./DeliveryCoverage";
import FinalCTA from "./FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <Hero />

      <TrustBar />

      <FeaturedCategories />

      <FeaturedProducts />

      <WhyBeautyHub />

      <ProductEducation />

      <VerifiedShopping />

      <HowItWorks />

      <DeliveryCoverage />

      <FinalCTA />
    </main>
  );
}