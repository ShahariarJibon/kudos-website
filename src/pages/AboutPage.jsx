import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import CountUp from '../components/ui/CountUp';
import LazyImage from '../components/ui/LazyImage';
import { STATS } from '../data/site';

const VALUES = [
  {
    title: 'Quality & Hygiene',
    desc: 'Signature aroma, distinctive taste and unswerving quality & hygiene — every single day, in every single outlet.',
  },
  {
    title: 'Affordable Deals',
    desc: 'The go-to spot for students seeking delicious meals within budget, and an ideal place for family get-togethers.',
  },
  {
    title: 'Something For Everyone',
    desc: 'From burgers to rice items, meat boxes, tenders, wedges, fries, sandwiches, subs, wraps and a variety of drinks.',
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About Us"
        title="About KUDOS"
        subtitle="From a single dream in 2020 to 18+ branches across Bangladesh — KUDOS is where great taste meets honest value."
      />

      {/* Story */}
      <section className="section-pad">
        <div className="container-kudos grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              align="left"
              kicker="Our Story"
              title="We’ve got something for everyone!"
              subtitle="Since 2020, we’ve been the go-to spot for students seeking delicious meals within budget and an ideal place for family get-togethers."
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700">
              <p>
                The signature aroma of the meal comes with distinctive taste and unswerving quality
                &amp; hygiene. From mouthwatering burgers to the richness of rice items, from spicy
                wings to quenching your thirst with a choco coffee freeze — there’s something for
                everyone!
              </p>
              <p>
                Burgers, rice items, meat boxes, chicken tenders, wedges, fries, sandwiches, subs
                &amp; wraps and a variety of drinks are all must-try. Discover the ultimate dining
                destination at KUDOS.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div>
                    <p className="font-heading text-3xl font-extrabold text-orange">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-maroon/5">
                <LazyImage
                  src="/images/about-flagship.jpg"
                  alt="KUDOS flagship branch atmosphere"
                  className="aspect-[4/5] w-full"
                  width={700}
                  height={875}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-glow sm:block">
                <p className="font-heading text-4xl font-black">2020</p>
                <p className="mt-1 text-sm text-white/90">Est. in Bangladesh</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos">
          <SectionTitle
            kicker="What We Stand For"
            title="Our promises to you"
            subtitle="Every KUDOS outlet follows the same recipe — literally and figuratively."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white font-heading text-lg font-bold shadow-glow">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-bold text-maroon">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;