"use client";

import { useEffect, useState } from "react";
import type { MotionPreference, Theme } from "@/components/ui";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Preference persistence remains optional enhancement state.
  }
}

function resolveTheme(): Theme {
  const selected = document.documentElement.dataset.theme;
  if (selected === "light" || selected === "dark") return selected;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function isMotionPreference(value: string | undefined): value is MotionPreference {
  return value === "system" || value === "full" || value === "reduced";
}

function motionIsReduced(motion: MotionPreference) {
  if (motion === "reduced") return true;
  return motion === "system" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runThemeSwap(swap: () => void, reduced: boolean) {
  const transitionDocument = document as ViewTransitionDocument;
  if (reduced || !transitionDocument.startViewTransition) {
    swap();
    return;
  }
  try {
    transitionDocument.startViewTransition(swap);
  } catch {
    swap();
  }
}

export function usePreferences() {
  const [motion, setMotion] = useState<MotionPreference>("system");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(resolveTheme());
    const selectedMotion = document.documentElement.dataset.motion;
    if (isMotionPreference(selectedMotion)) setMotion(selectedMotion);
  }, []);

  const changeTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const swap = () => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
      storageSet("jopy.theme.v1", next);
    };
    runThemeSwap(swap, motionIsReduced(motion));
  };

  const changeMotion = (next: MotionPreference) => {
    document.documentElement.dataset.motion = next;
    setMotion(next);
    storageSet("jopy.motion.v1", next);
    window.dispatchEvent(new Event("jopy:motion-change"));
  };

  return { changeMotion, changeTheme, motion, theme };
}
