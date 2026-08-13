import { SectionHeader } from "@/components/ui";

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: "C#, VB, Java, Python, Rust, Go, JavaScript, TypeScript, SQL, HTML, CSS",
  },
  {
    title: "Frameworks & technologies",
    items: "Node.js, Express.js, React.js, Next.js, REST APIs, PostgreSQL, Git, Playwright",
  },
  {
    title: "Machine learning",
    items: "TensorFlow, Scikit-learn, Pandas, NumPy",
  },
  {
    title: "AI-assisted development",
    items: "Claude Code, GPT Codex, Kimi AI, GLM AI",
  },
] as const;

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="content-section skills-section"
      aria-labelledby="skills-title"
      data-observed-section="skills"
    >
      <SectionHeader
        id="skills-title"
        title="Skills"
        summary="Supported technologies, grouped by working context rather than ranked by invented proficiency."
      />
      <div className="skills-register">
        {SKILL_GROUPS.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.items}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
