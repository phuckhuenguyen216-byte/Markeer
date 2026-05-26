import type { Metadata } from "next";
import GrowthCommissionSection from "../components/growth-system/GrowthCommissionSection";
import GrowthContributionSection from "../components/growth-system/GrowthContributionSection";
import GrowthCultureSection from "../components/growth-system/GrowthCultureSection";
import GrowthEveryoneSection from "../components/growth-system/GrowthEveryoneSection";
import GrowthFaqSection from "../components/growth-system/GrowthFaqSection";
import GrowthFinalSection from "../components/growth-system/GrowthFinalSection";
import GrowthHeroSection from "../components/growth-system/GrowthHeroSection";
import GrowthLayersSection from "../components/growth-system/GrowthLayersSection";
import GrowthLeadFlowSection from "../components/growth-system/GrowthLeadFlowSection";
import GrowthProtectionSection from "../components/growth-system/GrowthProtectionSection";
import GrowthWhySection from "../components/growth-system/GrowthWhySection";

export const metadata: Metadata = {
  title: "Markee AI Marketing - Nền tảng AI Marketing tất cả trong một",
  description: "Markee AI Marketing - Nền tảng AI Marketing tất cả trong một.",
};

export default function GrowthSystemPage() {
  return (
    <main className="growth-system-page relative overflow-x-hidden bg-[#fffafc] text-[#0b1020]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,98,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,98,120,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <GrowthHeroSection />
      <GrowthWhySection />
      <GrowthEveryoneSection />
      <GrowthLayersSection />
      <GrowthContributionSection />
      <GrowthLeadFlowSection />
      <GrowthCommissionSection />
      <GrowthProtectionSection />
      <GrowthCultureSection />
      <GrowthFaqSection />
      <GrowthFinalSection />
    </main>
  );
}
