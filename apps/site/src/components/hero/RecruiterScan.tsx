import { ArrowIcon, ButtonLink, ExternalAction, FieldSheet } from "@/components/ui";

const FIELD_ROWS = [
  { label: "System", value: "Personal portfolio" },
  { label: "Mode", value: "Survey / plotted" },
  { label: "Purpose", value: "Capability overview" },
  { label: "Evidence", value: "Owner-approved only" },
] as const;

function IdentityHeading() {
  return (
    <>
      <p className="survey-axis" aria-hidden="true">
        Identity reference
      </p>
      <h1 id="hero-title">JOPY DEV</h1>
      <div className="identity-rule" aria-hidden="true">
        <span />
      </div>
    </>
  );
}

function IdentityDetails() {
  return (
    <>
      <p className="person-name">Mark Jommer</p>
      <p className="role">Full-Stack Software Engineer</p>
      <p className="location">
        <span className="target-mark" aria-hidden="true" />
        Makati, Metro Manila
      </p>
    </>
  );
}

function RecruiterActions() {
  return (
    <nav className="hero-actions" aria-label="Primary actions">
      <ButtonLink href="#projects" variant="primary">
        <span>View projects</span>
        <ArrowIcon />
      </ButtonLink>
      <ExternalAction href="https://github.com/jopy-dev" label="GitHub" />
      <ExternalAction href="https://linkedin.com/in/markjommer" label="LinkedIn" />
    </nav>
  );
}

export function RecruiterScan() {
  return (
    <div className="identity-panel">
      <IdentityHeading />
      <IdentityDetails />
      <RecruiterActions />
      <FieldSheet rows={FIELD_ROWS} />
    </div>
  );
}
