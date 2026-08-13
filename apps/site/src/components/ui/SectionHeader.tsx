interface SectionHeaderProps {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
}

export function SectionHeader({ id, summary, title }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      {summary ? <p>{summary}</p> : null}
    </div>
  );
}
