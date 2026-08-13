export type SectionId = "top" | "skills" | "profile" | "projects" | "contact";

interface NavBarProps {
  readonly current: SectionId;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const NAV_ITEMS: readonly { readonly id: Exclude<SectionId, "top">; readonly label: string }[] = [
  { id: "skills", label: "Skills" },
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function NavBar({ current, onOpenChange, open }: NavBarProps) {
  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => onOpenChange(!open)}
      >
        <span>Menu</span>
        <i aria-hidden="true" />
      </button>
      <nav
        id="primary-navigation"
        className={`primary-navigation${open ? " is-open" : ""}`}
        aria-label="Primary"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={current === item.id ? "location" : undefined}
            onClick={() => onOpenChange(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
