export function PageSectionHead({
  index,
  label,
  title,
  lede,
}: {
  index?: string;
  label: string;
  title?: string;
  lede?: string;
}) {
  return (
    <div className="pf-sec-head">
      <p className="pf-sec-label">
        {index ? <span className="pf-sec-label__index">{index}</span> : null}
        {label}
      </p>
      {title ? <h2 className="pf-sec-title">{title}</h2> : null}
      {lede ? <p className="pf-sec-lede">{lede}</p> : null}
    </div>
  );
}