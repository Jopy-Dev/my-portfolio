const THEME_VALUES = ["light", "dark"];
const MOTION_VALUES = ["system", "full", "reduced"];

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function applyPreference(target, name, value, allowedValues) {
  if (value && allowedValues.includes(value)) target.dataset[name] = value;
}

(() => {
  const root = document.documentElement;
  applyPreference(root, "theme", readPreference("jopy.theme.v1"), THEME_VALUES);
  applyPreference(root, "motion", readPreference("jopy.motion.v1"), MOTION_VALUES);
})();
