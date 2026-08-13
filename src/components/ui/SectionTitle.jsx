import Reveal from './Reveal';

/**
 * SectionTitle  -  consistent kicker + heading + subtitle block.
 */
export default function SectionTitle({ kicker, title, subtitle, align = 'center', light = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';
  return (
    <Reveal className={`max-w-2xl ${alignment} ${align === 'center' ? '' : 'mr-auto'}`}>
      {kicker && (
        <p
          className={`mb-3 inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? 'text-orange' : 'text-orange'
          }`}
        >
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          {kicker}
          <span className="h-px w-8 bg-current" aria-hidden="true" />
        </p>
      )}
      <h2
        className={`font-heading text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? 'text-white' : 'text-maroon'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-white/80' : 'text-neutral-600'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
