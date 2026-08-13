interface DefinitionRow {
  readonly label: string;
  readonly value: string;
}

interface FieldSheetProps {
  readonly rows: readonly DefinitionRow[];
}

export function FieldSheet({ rows }: FieldSheetProps) {
  return (
    <dl className="field-sheet" aria-label="Portfolio field sheet">
      <div className="field-sheet-legend">
        <dt>Legend</dt>
        <dd>
          <svg aria-hidden="true" viewBox="0 0 120 42">
            <path d="M6 25c8-15 25-20 40-14 12 5 19 15 31 14 13-1 18-11 31-9" />
            <path d="M12 28c8-11 21-14 33-10 12 4 19 13 31 12 11-1 17-8 29-7" />
            <path d="M20 31c7-7 16-9 25-6 11 4 19 11 30 10 9-1 15-6 24-5" />
          </svg>
          <span>Qualitative contours / no rank</span>
        </dd>
      </div>
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
