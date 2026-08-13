import Reveal from './Reveal';

/**
 * PageHeader  -  animated hero band used at the top of inner pages.
 */
export default function PageHeader({ kicker, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-28 pb-14 sm:pt-36 sm:pb-20">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-redOrange/10 blur-3xl" />
      <div className="container-kudos relative text-center">
        <Reveal>
          {kicker && (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-maroon/5 px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-maroon">
              {kicker}
            </p>
          )}
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-maroon sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
