import { testimonials } from "@/content/testimonials";

/**
 * References, or nothing at all.
 *
 * Returns null while `testimonials` is empty. An empty testimonial rail with
 * a heading over it advertises the absence; no section advertises nothing.
 */
export function TestimonialsSection() {
  if (!testimonials.length) return null;

  return (
    <section id="references" className="section testimonials" aria-labelledby="testimonials-title">
      <div className="shell">
        <h2 className="sec-title" id="testimonials-title">
          What the people who worked with me say
        </h2>
        <ul className="testimonials__grid">
          {testimonials.map((item) => (
            <li className="testimonials__item" key={item.name + item.company}>
              <blockquote className="testimonials__quote">{item.quote}</blockquote>
              <p className="testimonials__by">
                <strong>{item.name}</strong>
                <span>
                  {item.role}, {item.company}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
