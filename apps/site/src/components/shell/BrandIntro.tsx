"use client";

import { useEffect, useState } from "react";

const WORDMARK = "JOPY DEV";
const CHARACTER_DELAY_MS = 55;
const EXIT_DELAY_MS = 320;
const READY_DELAY_MS = 980;

function markExperienceReady() {
  document.body.setAttribute("data-experience-ready", "true");
}

function effectiveReduced() {
  const motion = document.documentElement.dataset.motion ?? "system";
  return (
    motion === "reduced" ||
    (motion === "system" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  );
}

export function BrandIntro() {
  const [text, setText] = useState(WORDMARK);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("jopy.introSeen.v1") === "true";
    } catch {
      seen = false;
    }

    if (seen || effectiveReduced()) {
      markExperienceReady();
      return;
    }

    setText("");
    setVisible(true);
    let index = 0;
    let exitTimer: number | undefined;
    let readyTimer: number | undefined;
    const typing = window.setInterval(() => {
      index += 1;
      setText(WORDMARK.slice(0, index));
      if (index < WORDMARK.length) return;
      window.clearInterval(typing);
      exitTimer = window.setTimeout(() => setLeaving(true), EXIT_DELAY_MS);
      readyTimer = window.setTimeout(() => {
        setVisible(false);
        markExperienceReady();
      }, READY_DELAY_MS);
    }, CHARACTER_DELAY_MS);

    const stopForReducedMotion = () => {
      if (!effectiveReduced()) return;
      window.clearInterval(typing);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      if (readyTimer !== undefined) window.clearTimeout(readyTimer);
      setVisible(false);
      markExperienceReady();
    };
    window.addEventListener("jopy:motion-change", stopForReducedMotion);
    try {
      sessionStorage.setItem("jopy.introSeen.v1", "true");
    } catch {
      // Session storage is optional enhancement state.
    }

    return () => {
      window.clearInterval(typing);
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      if (readyTimer !== undefined) window.clearTimeout(readyTimer);
      window.removeEventListener("jopy:motion-change", stopForReducedMotion);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className={`brand-intro${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <span>{text}</span>
    </div>
  );
}
