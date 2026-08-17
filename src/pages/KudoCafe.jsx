import PageHeader from '../components/ui/PageHeader';
import Reveal from '../components/ui/Reveal';

function KudoCafe() {
  return (
    <>
      <PageHeader
        kicker="KudoCafe"
        title="KudoCafe"
        subtitle="KUDOS' cosy cafe corner  -  cold coffees, fresh fruit punches and hand-blended freezes. Brewing up soon."
      />

      {/* Coming soon */}
      <section className="section-pad bg-white">
        <div className="container-kudos">
          <Reveal className="flex flex-col items-center rounded-3xl bg-hero-gradient px-6 py-20 text-center sm:py-24">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
                <path d="M16 10h2a3 3 0 0 1 0 6h-2M5 4v2M9 4v2M13 4v2" />
              </svg>
            </span>
            <h2 className="mt-6 font-heading text-3xl font-extrabold text-maroon sm:text-4xl">Coming Soon</h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-700">
              KudoCafe is brewing up something special. Stay tuned for cold coffees, fresh fruit
              punches and hand-blended freezes.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-white shadow-glow">
              Coming Soon
            </span>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default KudoCafe;