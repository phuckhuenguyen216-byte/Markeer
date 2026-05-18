"use client"
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import Deployment from './components/Deployment';
import Permission from './components/Permission';
import Problems from './components/Problems';
import Solutions from './components/Solutions';
import CaseStudies from './components/CaseStudies';
import WhyMarkee from './components/WhyMarkee';
import MarkeeChatSection from './components/MarkeeChatSection';

export default function Home() {
  return (
    <main className="relative">
      <HeroBanner />
      <Problems />
      <Solutions />
      <FeaturesSection />
      <CaseStudies />
      <WhyMarkee />
      <Permission />
      <Deployment />
      <CTASection />
      <RegistrationForm />
      <MarkeeChatSection />
      <Footer />
    </main>
  );
}
