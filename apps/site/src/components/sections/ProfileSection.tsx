import { SectionHeader } from "@/components/ui";

const PRINCIPLES = [
  { label: "Architecture", value: "Clean boundaries, reusable systems, maintainable delivery." },
  { label: "Quality", value: "Performance, accessibility, testing, and secure authorization." },
  {
    label: "Practice",
    value: "Agile collaboration, continuous learning, leadership, and mentoring.",
  },
] as const;

function ProfilePrinciples() {
  return (
    <dl className="profile-principles">
      {PRINCIPLES.map((principle) => (
        <div key={principle.label}>
          <dt>{principle.label}</dt>
          <dd>{principle.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProfileContent() {
  return (
    <div className="profile-layout">
      <p className="profile-lead">
        I build scalable web, mobile, and desktop applications with TypeScript, React, Next.js,
        Node.js, and API architecture—guided by maintainability, performance, reusable systems,
        cloud readiness, and responsible AI-assisted development.
      </p>
      <ProfilePrinciples />
    </div>
  );
}

export function ProfileSection() {
  return (
    <section
      id="profile"
      className="content-section profile-section"
      aria-labelledby="profile-title"
      data-observed-section="profile"
    >
      <SectionHeader id="profile-title" title="Profile" />
      <ProfileContent />
    </section>
  );
}
