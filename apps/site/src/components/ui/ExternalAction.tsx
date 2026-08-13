import { ButtonLink } from "./Button";

interface ExternalActionProps {
  readonly href: string;
  readonly label: string;
  readonly unavailable?: boolean;
}

export function ExternalMark() {
  return <span className="external-mark" aria-hidden="true" />;
}

export function ExternalAction({ href, label, unavailable = false }: ExternalActionProps) {
  if (unavailable) return <span className="external-unavailable">{label} unavailable</span>;
  return (
    <ButtonLink href={href} target="_blank" rel="noopener noreferrer" variant="secondary">
      <span>{label}</span>
      <ExternalMark />
    </ButtonLink>
  );
}
