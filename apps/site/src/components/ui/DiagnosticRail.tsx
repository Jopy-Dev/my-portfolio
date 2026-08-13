import type { SectionId } from "./NavBar";

interface DiagnosticRailProps {
  readonly current: SectionId;
  readonly progress: number;
}

const SECTION_LABELS: Record<SectionId, string> = {
  top: "Top",
  skills: "Skills",
  profile: "Profile",
  projects: "Projects",
  contact: "Contact",
};

export function DiagnosticRail({ current, progress }: DiagnosticRailProps) {
  return (
    <aside className="diagnostic-rail" aria-label="Page position" aria-live="off">
      <div className="rail-label">
        <span>Current section</span>
        <strong>{SECTION_LABELS[current]}</strong>
      </div>
      <progress className="rail-track" max={100} value={progress} aria-label="Page progress" />
      <output aria-label="Page progress">{progress}%</output>
    </aside>
  );
}
