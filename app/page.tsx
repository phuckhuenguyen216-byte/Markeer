"use client"
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import SocialMedia from './components/SocialMedia';
import HeroBanner from './components/HeroBanner';
import Deployment from './components/Deployment';
import Permission from './components/Permission';
import Problems from './components/Problems';

export default function Home() {
  return (
    <main className="relative">
      <HeroBanner />
      <AboutSection />
      <Problems />
      <FeaturesSection />
      <Permission />
      <Deployment />
      <CTASection />
      <RegistrationForm />
      <Footer />
      <SocialMedia />
    </main>
  );
}