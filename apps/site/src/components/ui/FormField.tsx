import type { HTMLInputTypeAttribute } from "react";

interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly className?: string;
  readonly as?: "input" | "textarea";
  readonly name?: string;
  readonly type?: HTMLInputTypeAttribute;
  readonly autoComplete?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly rows?: number;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

export function FormField({
  as = "input",
  autoComplete,
  className,
  disabled,
  id,
  label,
  maxLength,
  minLength,
  name,
  required,
  rows,
  type,
}: FormFieldProps) {
  const sharedProps = { disabled, id, maxLength, minLength, name, required };
  return (
    <div className={["form-field", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea {...sharedProps} autoComplete={autoComplete} rows={rows} />
      ) : (
        <input {...sharedProps} autoComplete={autoComplete} type={type} />
      )}
    </div>
  );
}
