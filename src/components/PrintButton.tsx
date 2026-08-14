"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn--solid" onClick={() => window.print()}>
      <span className="btn__label">Download / Print</span>
    </button>
  );
}
