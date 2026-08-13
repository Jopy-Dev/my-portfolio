"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/components/ui";

const OBSERVER_THRESHOLDS = [0.05, 0.25, 0.55];
const SECTION_IDS: readonly SectionId[] = ["top", "skills", "profile", "projects", "contact"];
const MENU_DESKTOP_BREAKPOINT = 992;
const PROGRESS_MAXIMUM = 100;

function isSectionId(value: string | undefined): value is SectionId {
  return value !== undefined && SECTION_IDS.includes(value as SectionId);
}

function findVisibleSection(entries: IntersectionObserverEntry[]) {
  return entries
    .filter((entry) => entry.isIntersecting)
    .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
}

function createSectionObserver(setCurrent: (section: SectionId) => void) {
  return new IntersectionObserver(
    (entries) => {
      const target = findVisibleSection(entries)?.target;
      const sectionId = target instanceof HTMLElement ? target.dataset.observedSection : undefined;
      if (isSectionId(sectionId)) setCurrent(sectionId);
    },
    { rootMargin: "-20% 0px -62%", threshold: OBSERVER_THRESHOLDS },
  );
}

function calculateProgress() {
  const scrollableHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const normalized = (window.scrollY / scrollableHeight) * PROGRESS_MAXIMUM;
  return Math.min(PROGRESS_MAXIMUM, Math.max(0, Math.round(normalized)));
}

function bindProgressEvents(
  setProgress: (progress: number) => void,
  setMenuOpen: (open: boolean) => void,
) {
  let scheduled = false;
  const updateProgress = () => {
    setProgress(calculateProgress());
    scheduled = false;
  };
  const requestProgress = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
  };
  const handleResize = () => {
    if (window.innerWidth > MENU_DESKTOP_BREAKPOINT) setMenuOpen(false);
    requestProgress();
  };

  window.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", handleResize);
  updateProgress();

  return () => {
    window.removeEventListener("scroll", requestProgress);
    window.removeEventListener("resize", handleResize);
  };
}

export function usePagePosition() {
  const [current, setCurrent] = useState<SectionId>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = createSectionObserver(setCurrent);
    const sections = document.querySelectorAll<HTMLElement>("[data-observed-section]");
    sections.forEach((section) => {
      observer.observe(section);
    });
    const removeProgressEvents = bindProgressEvents(setProgress, setMenuOpen);
    return () => {
      observer.disconnect();
      removeProgressEvents();
    };
  }, []);

  return { current, menuOpen, progress, setMenuOpen };
}
