import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldBase {
  readonly id: string;
  readonly label: string;
  readonly className?: string;
}

type InputFieldProps = FieldBase & InputHTMLAttributes<HTMLInputElement>;
type TextareaFieldProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function InputField({ className, id, label, ...props }: InputFieldProps) {
  return (
    <div className={["form-field", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );
}

export function TextareaField({ className, id, label, ...props }: TextareaFieldProps) {
  return (
    <div className={["form-field", className].filter(Boolean).join(" ")}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...props} />
    </div>
  );
}
