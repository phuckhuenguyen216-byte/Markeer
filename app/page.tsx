"use client"
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import SocialMedia from './components/SocialMedia';
import HeroBanner from './components/HeroBanner';
export default function Home() {
  return (
    <main className="relative">
      <HeroBanner />
      <AboutSection />
      <FeaturesSection />
      <CTASection />
      <RegistrationForm />
      <Footer />
      <SocialMedia />
    </main>
  );
}