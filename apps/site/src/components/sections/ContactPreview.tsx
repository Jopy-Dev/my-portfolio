"use client";

import { type FormEvent, useRef, useState } from "react";
import { ArrowIcon, Button, ExternalMark, FormField, SectionHeader } from "@/components/ui";

const INVALID_PREVIEW_MESSAGE = "Check the highlighted fields, then try the preview again.";
const VALID_PREVIEW_MESSAGE = "Prototype verified. No message was sent or stored.";

function useContactPreview() {
  const [status, setStatus] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  const reportStatus = (message: string) => {
    setStatus(message);
    window.requestAnimationFrame(() => statusRef.current?.focus());
  };

  const submitPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) {
      reportStatus(INVALID_PREVIEW_MESSAGE);
      return;
    }
    reportStatus(VALID_PREVIEW_MESSAGE);
  };

  return { status, statusRef, submitPreview };
}

function ContactFields() {
  return (
    <>
      <FormField
        id="name"
        name="name"
        label="Name"
        autoComplete="name"
        minLength={2}
        maxLength={80}
        required
      />
      <FormField
        id="email"
        name="email"
        label="Reply email"
        type="email"
        autoComplete="email"
        maxLength={254}
        required
      />
      <FormField
        id="message"
        name="message"
        label="Message"
        className="form-field-message"
        as="textarea"
        minLength={10}
        maxLength={2000}
        rows={6}
        required
      />
    </>
  );
}

function ConsentField() {
  return (
    <label className="consent-check">
      <input type="checkbox" required />
      <span>I understand this local prototype does not send or store my message.</span>
    </label>
  );
}

function SubmitPreview() {
  return (
    <Button className="submit-action" variant="primary" type="submit">
      <span>Preview submission</span>
      <ArrowIcon />
    </Button>
  );
}

function ContactAlternatives() {
  return (
    <div className="contact-alternatives">
      <p>Professional profiles remain the reliable fallback.</p>
      <a href="https://github.com/jopy-dev" target="_blank" rel="noopener noreferrer">
        GitHub <ExternalMark />
      </a>
      <a href="https://linkedin.com/in/markjommer" target="_blank" rel="noopener noreferrer">
        LinkedIn <ExternalMark />
      </a>
    </div>
  );
}

export function ContactPreview() {
  const { status, statusRef, submitPreview } = useContactPreview();

  return (
    <section
      id="contact"
      className="content-section contact-section"
      aria-labelledby="contact-title"
      data-observed-section="contact"
    >
      <SectionHeader
        id="contact-title"
        title="Contact"
        summary="Prototype interaction only. No message leaves this page."
      />
      <div className="contact-layout">
        <form className="contact-form" onSubmit={submitPreview} noValidate>
          <ContactFields />
          <ConsentField />
          <SubmitPreview />
          <p className="form-status" role="status" tabIndex={-1} ref={statusRef}>
            {status}
          </p>
        </form>
        <ContactAlternatives />
      </div>
    </section>
  );
}
