import { siteConfig } from "@/lib/site-config";

const STATIONS = [
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "desktop", label: "Desktop" },
  { id: "ai", label: "AI-Assisted Development" },
] as const;
const TERRAIN_WIDTHS = [640, 960, 1280, 1536] as const;

function terrainSourceSet(format: "avif" | "webp") {
  return TERRAIN_WIDTHS.map(
    (width) =>
      `${siteConfig.assetPath(`/assets/terrain/night-atlas-${width}.${format}`)} ${width}w`,
  ).join(", ");
}

function TerrainPicture() {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={terrainSourceSet("avif")}
        sizes="(max-width: 62rem) 100vw, 58vw"
      />
      <source
        type="image/webp"
        srcSet={terrainSourceSet("webp")}
        sizes="(max-width: 62rem) 100vw, 58vw"
      />
      <img
        className="terrain-lines"
        src={siteConfig.assetPath("/assets/terrain/night-atlas-1536.webp")}
        alt=""
        width="1536"
        height="1024"
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}

function VerticalTerrainAxis() {
  return (
    <div className="axis-ticks axis-ticks-y" aria-hidden="true">
      <span>Northing</span>
      <i />
      <b>Q-04</b>
      <b>Q-03</b>
      <b>Q-02</b>
      <b>Q-01</b>
    </div>
  );
}

function HorizontalTerrainAxis() {
  return (
    <div className="axis-ticks axis-ticks-x" aria-hidden="true">
      <span>Easting / qualitative grid</span>
      <i />
      <b>W</b>
      <b>M</b>
      <b>D</b>
      <b>AI</b>
    </div>
  );
}

function TerrainRoute() {
  return (
    <svg
      className="route-overlay"
      aria-hidden="true"
      viewBox="0 0 1400 980"
      preserveAspectRatio="none"
    >
      <path
        className="route-path"
        d="M118 735C284 628 366 508 508 516S724 675 848 584s163-280 332-337 190-14 246-63"
      />
      <g className="route-nodes">
        <circle cx="118" cy="735" r="5" />
        <circle cx="508" cy="516" r="5" />
        <circle cx="848" cy="584" r="5" />
        <circle cx="1180" cy="247" r="5" />
      </g>
    </svg>
  );
}

function TerrainStations() {
  return (
    <ol className="capability-stations">
      {STATIONS.map((station) => (
        <li key={station.id} className={`station station-${station.id}`}>
          <span className="station-target" aria-hidden="true" />
          <span>{station.label}</span>
        </li>
      ))}
    </ol>
  );
}

export function CapabilitySurvey() {
  return (
    <section className="terrain" aria-labelledby="capability-survey-title">
      <TerrainPicture />
      <p id="capability-survey-title" className="map-instruction">
        Engineering range / qualitative map
      </p>
      <VerticalTerrainAxis />
      <HorizontalTerrainAxis />
      <TerrainRoute />
      <TerrainStations />
    </section>
  );
}
