import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import MenuCard from '../components/MenuCard';
import LazyImage from '../components/ui/LazyImage';
import { MENU_CATEGORIES, MENU_POSTERS } from '../data/menu';
import { SITE } from '../data/site';

function MenuPage() {
  const [active, setActive] = useState('all');
  const reduce = useReducedMotion();

  const categories = [{ id: 'all', label: 'All Items', blurb: 'Everything on the KUDOS menu.', items: MENU_CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, category: c.label }))) }, ...MENU_CATEGORIES];
  const current = categories.find((c) => c.id === active);

  return (
    <>
      <PageHeader
        kicker="Food Menu"
        title="Our Menu"
        subtitle="Burgers, wings, rice meals, wraps, sandwiches, fries and freezes — grilled, toasted and shaken fresh in our live kitchen."
      />

      {/* Category filter */}
      <section className="sticky top-16 z-30 border-b border-maroon/10 bg-white/90 py-4 backdrop-blur-md sm:top-20">
        <div className="container-kudos flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Menu categories" style={{ scrollbarWidth: 'none' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={`chip whitespace-nowrap border ${
                active === c.id
                  ? 'border-transparent bg-brand-gradient text-white shadow-glow'
                  : 'border-maroon/15 bg-white text-maroon hover:border-orange/60 hover:bg-orange/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Menu grid */}
      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-10 max-w-2xl">
                <h2 className="font-heading text-2xl font-extrabold text-maroon sm:text-3xl">{current.label}</h2>
                <p className="mt-2 text-neutral-600">{current.blurb}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {current.items.map((item, i) => (
                  <Reveal key={item.name} delay={(i % 4) * 0.07} y={20}>
                    <MenuCard item={item} showCategory={active === 'all'} />
                  </Reveal>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <Reveal className="mt-16">
            <p className="mb-4 text-center font-heading text-sm font-semibold uppercase tracking-[0.2em] text-maroon">
              Prices may vary slightly across outlets · Visit any branch for the complete live menu
            </p>
          </Reveal>
        </div>
      </section>

      {/* Full printed menu posters */}
      <section className="section-pad bg-white">
        <div className="container-kudos">
          <SectionTitle
            kicker="Full Menu"
            title="The Complete KUDOS Menu"
            subtitle="Browse the full printed menu below — every item, every category, in one place."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {MENU_POSTERS.map((p, i) => (
              <Reveal key={p.src} delay={i * 0.1}>
                <figure className="overflow-hidden rounded-2xl shadow-card ring-1 ring-maroon/5">
                  <LazyImage
                    src={p.src}
                    alt={p.alt}
                    className="aspect-[3/4] w-full"
                    imgClassName="transition-transform duration-500 hover:scale-105"
                    width={800}
                    height={1067}
                  />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering channels */}
      <section className="section-pad bg-maroon text-white">
        <div className="container-kudos">
          <SectionTitle
            light
            kicker="Order Now"
            title="Order through your favourite platform"
            subtitle="Choose KUDOS on your preferred ordering platform, or order directly through our partner channel."
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <a
              href={SITE.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand"
              aria-label="Order directly through our partner platform"
            >
              Order Direct
            </a>
            <a href={SITE.phoneHref} className="btn-outline !border-white !text-white hover:!border-white hover:bg-white hover:!text-maroon">
              Call to Order
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default MenuPage;