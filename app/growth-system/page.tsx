import type { Metadata } from "next";
import GrowthCommissionSection from "../components/growth-system/GrowthCommissionSection";
import GrowthContributionSection from "../components/growth-system/GrowthContributionSection";
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
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_10%,rgba(255,77,95,0.09)_0%,rgba(255,255,255,0)_32%),radial-gradient(circle_at_88%_0%,rgba(47,115,255,0.08)_0%,rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffafc_0%,#ffffff_45%,#fff9fb_100%)]" />
      <GrowthHeroSection />
      <GrowthWhySection />
      <GrowthCommissionSection />
      <GrowthLeadFlowSection />
      <GrowthContributionSection />
      <GrowthLayersSection />
      <GrowthProtectionSection />
      <GrowthFaqSection />
      <GrowthFinalSection />
    </main>
  );
}
