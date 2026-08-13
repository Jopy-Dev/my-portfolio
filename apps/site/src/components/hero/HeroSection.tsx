import { CapabilitySurvey } from "./CapabilitySurvey";
import { RecruiterScan } from "./RecruiterScan";

const REGISTRATION_CORNERS = ["nw", "ne", "sw", "se"] as const;

function RegistrationMarks() {
  return REGISTRATION_CORNERS.map((corner) => (
    <span key={corner} className={`registration registration-${corner}`} aria-hidden="true" />
  ));
}

export function HeroSection() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title" data-observed-section="top">
      <div className="survey-frame">
        <RegistrationMarks />
        <RecruiterScan />
        <CapabilitySurvey />
      </div>
    </section>
  );
}
