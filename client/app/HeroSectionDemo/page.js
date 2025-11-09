import { HeroSection } from "@/components/blocks/hero-section-dark";

function HeroSectionDemo() {
  return (
    <HeroSection
      title="Welcome to Kudos To Code"
      subtitle={{
        regular: "Track your achievements, line by line ",
        gradient: "Earn the kudos you deserves.",
      }}
      description="Track Your Progress."
      ctaText="Get Started"
      ctaHref="/signup"
      bottomImage={{
        light: "https://www.launchuicomponents.com/app-light.png",
        dark: "https://www.launchuicomponents.com/app-dark.png",
      }}
      gridOptions={{
        angle: 65,
        opacity: 0.4,
        cellSize: 50,
        lightLineColor: "#4a4a4a",
        darkLineColor: "#2a2a2a",
      }}
    />
  );
}

export default HeroSectionDemo;
