"use client";

import { DiagnosticRail, NavBar, Preferences } from "@/components/ui";
import { usePagePosition } from "./usePagePosition";
import { usePreferences } from "./usePreferences";

export function PageInstruments() {
  const { current, menuOpen, progress, setMenuOpen } = usePagePosition();
  const { changeMotion, changeTheme, motion, theme } = usePreferences();

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Jopy-Dev home">
          JOPY DEV
        </a>
        <NavBar current={current} open={menuOpen} onOpenChange={setMenuOpen} />
        <Preferences
          theme={theme}
          motion={motion}
          onThemeChange={changeTheme}
          onMotionChange={changeMotion}
        />
      </header>
      <DiagnosticRail current={current} progress={progress} />
    </>
  );
}
