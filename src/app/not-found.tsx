import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="mono faint">404</p>
      <h1 className="sec-title">Looks like this route went off the grid.</h1>
      <Link className="btn btn--solid" href="/">
        <span className="btn__label">Back to Home</span>
      </Link>
    </section>
  );
}
