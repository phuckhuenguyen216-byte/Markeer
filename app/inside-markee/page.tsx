import InsideMarkeeHero from "../components/inside-markee/InsideMarkeeHero";
import InsideMarkeeWhyExists from "../components/inside-markee/InsideMarkeeWhyExists";
import InsideMarkeeWhatBuilding from "../components/inside-markee/InsideMarkeeWhatBuilding";
import InsideMarkeeEcosystemSection from "../components/inside-markee/InsideMarkeeEcosystemSection";
import InsideMarkeeRoadmapSection from "../components/inside-markee/InsideMarkeeRoadmapSection";
import InsideMarkeePhaseOneDetailSection from "../components/inside-markee/InsideMarkeePhaseOneDetailSection";
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
      <InsideMarkeeRoadmapSection />
      <InsideMarkeePhaseOneDetailSection />
      <InsideMarkeeTeamRolesSection />
      <InsideMarkeeTeamCultureSection />
      <InsideMarkeeFaqSection />
      <InsideMarkeeFinalCtaSection />
    </main>
  );
}
