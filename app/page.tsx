"use client"
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import SocialMedia from './components/SocialMedia';
import HeroBanner from './components/HeroBanner';
import Deployment from './components/Deployment';
import Permission from './components/Permission';
import Problems from './components/Problems';
import MarkeeChatSection from './components/MarkeeChatSection';

export default function Home() {
  return (
    <main className="relative">
      <HeroBanner />
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
