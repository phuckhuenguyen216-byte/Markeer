"use client";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import MarkeeMarketingHero from "../components/MarkeeMarketingHero";
import Deployment from "../components/Deployment";
import Permission from "../components/Permission";
import Problems from "../components/Problems";
import MarkeeChatSection from "../components/MarkeeChatSection";

export default function MarkeeMarketingPage() {
  return (
    <main className="relative">
      <MarkeeMarketingHero />
      <Problems />
      <FeaturesSection />
      <Permission />
      <Deployment />
      <CTASection />
      <RegistrationForm />
      <MarkeeChatSection />
      <Footer />
      <SocialMedia />
    </main>
  );
}
