import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import LazyImage from '../components/ui/LazyImage';
import { SITE } from '../data/site';

const CAFE_FEATURES = [
  { title: 'Choco Coffee Freeze', desc: 'The cold coffee sensation that made KUDOS famous — hand blended, ice cold, dangerously addictive.', icon: 'coffee' },
  { title: 'Fruit Punches', desc: 'Apple, orange and fruit punches pressed fresh to brighten up your day.', icon: 'fruit' },
  { title: 'Freezes & More', desc: 'A rotating lineup of shakes and freezes served in every outlet, all day.', icon: 'shake' },
  { title: 'Cafe Vibes', desc: 'Cozy seating, AC comfort and free Wi-Fi in flagship branches — perfect for a coffee break.', icon: 'couch' },
];

const icon = {
  coffee: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" />
      <path d="M16 10h2a3 3 0 0 1 0 6h-2M5 4v2M9 4v2M13 4v2" />
    </svg>
  ),
  fruit: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21c-4 0-7-3-7-7 0-5 3-10 7-10s7 5 7 10c0 4-3 7-7 7z" />
      <path d="M10 7c1.5-2 4-2 5 1" />
    </svg>
  ),
  shake: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 9h10l-1.2 11a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8L7 9z" />
      <path d="M8 9l2 -5m6 5l-2-5" />
    </svg>
  ),
  couch: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 11V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2" />
      <path d="M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 1 1 4 0v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
    </svg>
  ),
};

function KudoCafe() {
  return (
    <>
      <PageHeader
        kicker="KudoCafe"
        title="KudoCafe"
        subtitle="KUDOS' cosy cafe corner — cold coffees, fresh fruit punches and hand-blended freezes to pair with your favourite bites."
      />

      {/* Cafe story */}
      <section className="section-pad bg-white">
        <div className="container-kudos grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-maroon/5">
              <LazyImage
                src="/images/kudocafe-menu.jpg"
                alt="KudoCafe full menu"
                className="aspect-[3/4] w-full"
                imgClassName="transition-transform duration-700 hover:scale-105"
                width={800}
                height={1067}
              />
            </div>
          </Reveal>
          <div>
            <SectionTitle
              align="left"
              kicker="The Cafe Corner"
              title="Coffee culture, KUDOS style"
              subtitle="Born as a sub-brand of the KUDOS kitchen, KudoCafe brings café favourites to our fast food family — from the legendary Choco Coffee Freeze to bright, zesty fruit punches."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {CAFE_FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-card">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                      {icon[f.icon]}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-maroon">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold text-maroon sm:text-4xl">
              Refresh with a KudoCafe freeze
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-700">
              Available at all KUDOS outlets. Order ahead and have it chilled &amp; ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={SITE.orderUrl} target="_blank" rel="noopener noreferrer" className="btn-brand">
                Order Now
              </a>
              <a href={SITE.phoneHref} className="btn-outline">
                {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default KudoCafe;