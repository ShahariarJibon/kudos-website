import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { SITE, STATS } from '../data/site';
import { useBusinessInfo, useMenuData } from '../services/publicData';
import MenuCard from '../components/MenuCard';
import AutoCarousel from '../components/AutoCarousel';
import Reveal from '../components/ui/Reveal';
import SectionTitle from '../components/ui/SectionTitle';
import CountUp from '../components/ui/CountUp';
import LazyImage from '../components/ui/LazyImage';

// Curated names for the hero marquee (falls back gracefully if an item is missing)
const SIGNATURE_NAMES = [
  '90s Classic Chicken Burger',
  'Naga Wings (6 pcs)',
  'Chicken Cheese Burger',
  'Lemon Smoked Rice with Peri Peri Chicken',
  'Chicken Tenders',
  'Loaded Meatbox',
  'Choco Coffee Freeze (Small)',
  'Tandoori Wrap',
  'Meat Madness',
  'Chicken Sub-Sandwich',
  'Crunchy Wrap',
  'Handcrafted Fries',
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const HeroFloat = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -60]);
  const rotate = useTransform(scrollY, [0, 500], [0, -4]);

  if (reduce) {
    return (
      <LazyImage
        src="/images/home_logo.png"
        alt="KUDOS signature burger"
        eager
        className="mx-auto w-64 sm:w-80 lg:w-full lg:max-w-md aspect-square rounded-full ring-4 ring-white/80 shadow-card"
        imgClassName="scale-110"
      />
    );
  }

  return (
    <motion.div
      style={{ y, rotate }}
      className="relative mx-auto w-72 sm:w-80 lg:w-full lg:max-w-md"
    >
      <LazyImage
        src="/images/home_logo.png"
        alt="KUDOS signature burger"
        eager
        className="aspect-square w-full animate-float-slow rounded-full ring-4 ring-white/80 shadow-[0_30px_50px_rgba(127,32,32,0.35)]"
        imgClassName="scale-110"
      />
      <span
        aria-hidden="true"
        className="absolute -top-3 -left-3 rounded-full bg-orange px-4 py-1.5 font-heading text-xs font-bold text-white shadow-glow sm:text-sm"
      >
        Since 2020
      </span>
      <span
        aria-hidden="true"
        className="absolute -bottom-3 -right-2 rounded-full bg-maroon px-4 py-1.5 font-heading text-xs font-bold text-white shadow-card sm:text-sm"
      >
        Est. Dhaka
      </span>
    </motion.div>
  );
};

function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-hero-gradient pb-20 pt-28 sm:pt-36 lg:pb-28">
      <div className="container-kudos relative grid items-center gap-12 lg:grid-cols-2">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.p variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-maroon shadow-card">
            Fast Food Chain · Bangladesh
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-5 font-heading text-5xl font-black leading-[1.05] tracking-tight text-maroon sm:text-6xl lg:text-7xl"
          >
            {SITE.tagline.split(' ').map((w, i) =>
              i === 4 ? (
                <span key={i} className="bg-brand-gradient bg-clip-text text-transparent">
                  {w}{' '}
                </span>
              ) : (
                <span key={i}>{w} </span>
              )
            )}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg">
            KUDOS is a fast food chain restaurant established in 2020 that serves a wide variety of
            flavour-filled, high quality meals at affordable deals. The signature aroma comes with
            distinctive taste and unswerving quality &amp; hygiene.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/menu" className="btn-brand !text-base">
              Explore Menu
            </Link>
          </motion.div>
          <motion.dl variants={itemVariants} className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-3xl font-extrabold text-orange">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroFloat />
        </motion.div>
      </div>
    </section>
  );
}

function Home() {
  const { items } = useMenuData();
  const info = useBusinessInfo();
  const signatureItems = SIGNATURE_NAMES.map((name) => items.find((i) => i.name === name)).filter(Boolean);

  return (
    <>
      <Hero />

      {/* Food carousel */}
      <section className="py-10" aria-label="Signature dishes showcase">
        <div className="container-kudos">
          <p className="mb-6 text-center font-heading text-sm font-semibold uppercase tracking-[0.2em] text-maroon">
            Fresh from the live kitchen
          </p>
        </div>
        {signatureItems.length > 0 && (
          <AutoCarousel ariaLabel="Auto-scrolling food showcase">
            {signatureItems.map((item) => (
              <div key={item.name} className="w-56 shrink-0 sm:w-64">
                <MenuCard item={item} />
              </div>
            ))}
          </AutoCarousel>
        )}
      </section>

      {/* Menu preview */}
      <section className="section-pad bg-white">
        <div className="container-kudos">
          <SectionTitle
            kicker="Most Loved"
            title="Crowd Favourites"
            subtitle="From flame-grilled burgers to smoky rice meals and ice-cold freezes  -  a taste of what keeps Dhaka coming back."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 8).map((item, i) => (
              <Reveal key={item.name} delay={(i % 4) * 0.08}>
                <MenuCard item={item} showCategory />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/menu" className="btn-brand">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Opening hours + contact */}
      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
              <SectionTitle
                align="left"
                kicker="Visit Us"
                title="Opening Hours & Contact"
                subtitle="Walk in, call ahead, or order online  -  we are here for your cravings."
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-orange">
                    Opening Time
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {info.hours.map((h) => (
                      <li key={h.days} className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 px-4 py-3">
                        <span className="font-medium text-neutral-700">{h.days}</span>
                        <span className="font-heading font-bold text-maroon">
                          {h.open}  -  {h.close}
                        </span>
                      </li>
                    ))}
                    <li className="rounded-xl bg-maroon px-4 py-3 text-sm text-white">
                      Closed on public holidays  -  follow our socials for updates.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-orange">
                    Get In Touch
                  </h3>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <a href={info.phoneHref} className="flex min-h-[48px] items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 font-medium text-neutral-700 transition-all hover:bg-brand-gradient hover:text-white">
                        {info.phone}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${info.email}`} className="flex min-h-[48px] items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 font-medium text-neutral-700 transition-all hover:bg-brand-gradient hover:text-white">
                        {info.email}
                      </a>
                    </li>
                  </ul>
                  <div className="mt-4 flex items-center gap-3">
                    {Object.entries(info.socials).map(([key, social]) => (
                      <a
                        key={key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`KUDOS on ${social.label}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-maroon transition-all hover:bg-brand-gradient hover:text-white"
                      >
                        {social.label === 'Facebook' && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.6-1.6H16.4V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.5v3h2.5v7h3.5z" />
                          </svg>
                        )}
                        {social.label === 'Instagram' && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                          </svg>
                        )}
                        {social.label === 'YouTube' && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Band  -  order online + full menu list */}
      <section className="pb-20 sm:pb-24" aria-label="Order online band">
        <div className="container-kudos">
          <Reveal>
            <div className="rounded-3xl bg-brand-gradient p-8 text-white shadow-glow sm:p-12 lg:p-14">
              <div className="flex flex-col items-center text-center">
                <p className="font-heading text-sm font-semibold uppercase tracking-widest text-white/80">
                  CTA Band
                </p>
                <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-snug sm:text-4xl">
                  Hungry? Good. <br className="hidden sm:block" /> That&apos;s the plan.
                </h2>
                <p className="mt-4 max-w-xl text-white/90">
                  Skip the queue  -  browse the full menu, pick your KUDOS favourites and order in
                  just a few taps.
                </p>
                <Link
                  to="/menu"
                  className="btn-outline mt-8 !border-white !text-white hover:!border-white hover:bg-white hover:!text-maroon"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default Home;