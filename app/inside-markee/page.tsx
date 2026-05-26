import InsideMarkeeHero from "../components/inside-markee/InsideMarkeeHero";
import InsideMarkeeWhyExists from "../components/inside-markee/InsideMarkeeWhyExists";
import InsideMarkeeWhatBuilding from "../components/inside-markee/InsideMarkeeWhatBuilding";
import InsideMarkeeEcosystemSection from "../components/inside-markee/InsideMarkeeEcosystemSection";
import InsideMarkeeServiceFirstSection from "../components/inside-markee/InsideMarkeeServiceFirstSection";
import InsideMarkeeRoadmapSection from "../components/inside-markee/InsideMarkeeRoadmapSection";
import InsideMarkeePhaseOneDetailSection from "../components/inside-markee/InsideMarkeePhaseOneDetailSection";
import InsideMarkeeCurrentOperationsSection from "../components/inside-markee/InsideMarkeeCurrentOperationsSection";
import InsideMarkeeGrowthSystemSection from "../components/inside-markee/InsideMarkeeGrowthSystemSection";
import InsideMarkeeInternalAutomationSection from "../components/inside-markee/InsideMarkeeInternalAutomationSection";
import InsideMarkeeTeamRolesSection from "../components/inside-markee/InsideMarkeeTeamRolesSection";
import InsideMarkeeTeamCultureSection from "../components/inside-markee/InsideMarkeeTeamCultureSection";
import InsideMarkeeFaqSection from "../components/inside-markee/InsideMarkeeFaqSection";
import InsideMarkeeFinalCtaSection from "../components/inside-markee/InsideMarkeeFinalCtaSection";

export default function InsideMarkeePage() {
  return (
    <main className="inside-markee-page relative overflow-x-hidden bg-white">
      <InsideMarkeeHero />
      <InsideMarkeeWhyExists />
      <InsideMarkeeWhatBuilding />
      <InsideMarkeeEcosystemSection />
      <InsideMarkeeServiceFirstSection />
      <InsideMarkeeRoadmapSection />
      <InsideMarkeePhaseOneDetailSection />
      <InsideMarkeeCurrentOperationsSection />
      <InsideMarkeeGrowthSystemSection />
      <InsideMarkeeInternalAutomationSection />
      <InsideMarkeeTeamRolesSection />
      <InsideMarkeeTeamCultureSection />
      <InsideMarkeeFaqSection />
      <InsideMarkeeFinalCtaSection />
    </main>
  );
}
