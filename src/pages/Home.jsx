import HeroSection from "../components/home/HeroSection";
import StatsBar from "../components/home/StatsBar";
import QuickLinks from "../components/home/QuickLinks";
import Features from "../components/home/Features";
import DeveloperGuide from "../components/home/DeveloperGuide";
import APIReference from "../components/home/APIReference";
import SupportedLanguages from "../components/home/SupportedLanguages";

export default function Home() {
  return (
    <div className="page">
      <HeroSection />
      <StatsBar />
      <QuickLinks />
      <Features />
      <DeveloperGuide />
      <APIReference />
      <SupportedLanguages />
    </div>
  );
}
