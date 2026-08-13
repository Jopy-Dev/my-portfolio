import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "instrument";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly pending?: boolean;
}

interface ButtonLinkProps {
  readonly children: ReactNode;
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly className?: string;
  readonly target?: "_blank";
  readonly rel?: string;
}

function classNames(variant: ButtonVariant, className?: string) {
  return ["ui-button", `ui-button-${variant}`, className].filter(Boolean).join(" ");
}

export function ArrowIcon() {
  return (
    <svg className="button-arrow" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  );
}

export function Button({
  children,
  className,
  pending = false,
  variant = "instrument",
  ...props
}: ButtonProps) {
  return (
    <button className={classNames(variant, className)} aria-busy={pending || undefined} {...props}>
      {pending ? "Submitting" : children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  href,
  variant = "secondary",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={classNames(variant, className)} href={href} {...props}>
      {children}
    </a>
  );
}
