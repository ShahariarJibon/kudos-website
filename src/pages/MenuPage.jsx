import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import MenuCard from '../components/MenuCard';
import { useMenuData } from '../services/publicData';
import { SITE } from '../data/site';

function MenuPage() {
  const [active, setActive] = useState('all');
  const reduce = useReducedMotion();
  const { categories } = useMenuData();

  const menuCategories = [
    { id: 'all', label: 'All Items', blurb: 'Everything on the KUDOS menu.', items: categories.flatMap((c) => c.items) },
    ...categories,
  ];
  const current = menuCategories.find((c) => c.id === active);

  return (
    <>
      <PageHeader
        kicker="Food Menu"
        title="Our Menu"
        subtitle="Burgers, wings, rice meals, wraps, sandwiches, fries and freezes  -  grilled, toasted and shaken fresh in our live kitchen."
      />

      {/* Category filter */}
      <section className="py-3 sm:py-4">
        <div
          className="relative mx-auto flex max-w-7xl gap-1.5 overflow-x-auto rounded-2xl border border-white/70 bg-[#F7F1DE]/60 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_-16px_rgba(127,32,32,0.28)] backdrop-blur-2xl backdrop-saturate-150"
          role="tablist"
          aria-label="Menu categories"
          style={{ scrollbarWidth: 'none' }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 via-white/10 to-transparent opacity-70"
          />
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-heading text-sm font-semibold transition-colors ${
                active === c.id ? 'text-maroon' : 'text-neutral-600 hover:text-maroon'
              }`}
            >
              {active === c.id && (
                <motion.span
                  layout={!reduce}
                  layoutId={reduce ? undefined : 'menu-cat-pill'}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 overflow-hidden rounded-full border border-white/70 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_-2px_rgba(127,32,32,0.15)] backdrop-blur-xl backdrop-saturate-150"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-transparent"
                  />
                </motion.span>
              )}
              <span className="relative z-10">{c.label}</span>
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