"use client";

/**
 * Opens the browser print dialog for the resume sheet.
 *
 * Browsers derive the default "Save as PDF" filename from document.title, so
 * the title is swapped for the duration of the dialog — otherwise the download
 * lands as "Resume | Rabin R.pdf" with the site's title suffix attached. The
 * restore is queued rather than run inline because window.print() is
 * synchronous in some browsers and deferred in others; a listener on
 * afterprint covers the deferred case, and the timeout covers browsers that
 * never fire it.
 */
export function PrintButton({
  fileName,
  label = "Download / Print",
}: {
  fileName?: string;
  label?: string;
}) {
  const handlePrint = () => {
    if (!fileName) {
      window.print();
      return;
    }

    const original = document.title;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = original;
      window.removeEventListener("afterprint", restore);
    };

    document.title = fileName;
    window.addEventListener("afterprint", restore);
    window.print();
    window.setTimeout(restore, 1000);
  };

  return (
    <button type="button" className="btn btn--solid" onClick={handlePrint}>
      <span className="btn__label">{label}</span>
    </button>
  );
}
