export type Theme = "dark" | "light";
export type MotionPreference = "system" | "full" | "reduced";

interface PreferencesProps {
  readonly theme: Theme;
  readonly motion: MotionPreference;
  readonly onThemeChange: () => void;
  readonly onMotionChange: (value: MotionPreference) => void;
}

const MOTION_OPTIONS: readonly MotionPreference[] = ["system", "full", "reduced"];

export function Preferences({ motion, onMotionChange, onThemeChange, theme }: PreferencesProps) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <div className="preference-tools">
      <button
        className="instrument-button"
        type="button"
        onClick={onThemeChange}
        aria-label={`Switch to ${nextTheme} theme`}
      >
        <span className="theme-symbol" aria-hidden="true" />
        <span>{theme === "dark" ? "Dark" : "Light"}</span>
      </button>
      <fieldset className="motion-control">
        <legend>Motion</legend>
        {MOTION_OPTIONS.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="motion"
              value={option}
              checked={motion === option}
              onChange={() => onMotionChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
