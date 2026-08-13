import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import { OUTLETS } from '../data/outlets';
import { useBusinessInfo } from '../services/publicData';
import { useState } from 'react';

// Centered on Dhaka  -  all outlets are within Bangladesh.
const MAP_EMBED_SRC =
  'https://www.google.com/maps?q=KUDOS+Bangladesh&hl=en&z=11&output=embed';

function OutletCard({ outlet, i }) {
  return (
    <Reveal delay={(i % 3) * 0.07} className="h-full">
      <article
        className={`relative flex h-full flex-col rounded-2xl p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
          outlet.flagship
            ? 'bg-brand-gradient text-white ring-transparent shadow-glow'
            : 'bg-white text-neutral-800 ring-maroon/10'
        }`}
      >
        {outlet.flagship && (
          <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider">
            Flagship
          </span>
        )}
        <h3 className="font-heading text-lg font-bold">{outlet.name}</h3>
        <p className={`mt-2 flex-1 text-sm leading-relaxed ${outlet.flagship ? 'text-white/90' : 'text-neutral-600'}`}>
          {outlet.address}
        </p>
        <a
          href={outlet.phoneHref}
          className={`mt-4 inline-flex min-h-[44px] items-center gap-2 font-heading text-sm font-semibold transition-colors ${
            outlet.flagship ? 'text-white underline-offset-4 hover:underline' : 'text-maroon hover:text-orange'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 21c-4.5-4.4-7-7.1-7-10a7 7 0 0 1 14 0c0 2.9-2.5 5.6-7 10z" />
            <circle cx="12" cy="11" r="2.4" />
          </svg>
          {outlet.phone}
        </a>
      </article>
    </Reveal>
  );
}

function OutletLocation() {
  const info = useBusinessInfo();
  const inside = OUTLETS.filter((o) => o.region === 'Inside Dhaka');
  const outside = OUTLETS.filter((o) => o.region === 'Outside Dhaka');
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader
        kicker="Outlet Location"
        title="Find a KUDOS near you"
        subtitle="18+ outlets across Dhaka, Khulna, Chattogram, Cumilla, Rajshahi and Tangail. Walk in, call ahead or order online."
      />

      {/* Map */}
      <section className="section-pad bg-hero-gradient pb-10">
        <div className="container-kudos">
          <Reveal className="overflow-hidden rounded-3xl shadow-card ring-1 ring-maroon/10">
            <iframe
              title="KUDOS outlet locations map"
              src={MAP_EMBED_SRC}
              className="h-[420px] w-full lg:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </section>

      {/* Inside Dhaka */}
      <section className="section-pad py-12">
        <div className="container-kudos">
          <SectionTitle
            align="left"
            kicker="Inside Dhaka"
            title="Dhaka outlets"
            subtitle="Thirteen locations across the capital  -  including our landmark Uttara and Bashundhara flagship branches."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inside.map((o, i) => (
              <OutletCard key={o.name} outlet={o} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Outside Dhaka */}
      <section className="section-pad py-12 bg-hero-gradient">
        <div className="container-kudos">
          <SectionTitle
            align="left"
            kicker="Outside Dhaka"
            title="Across Bangladesh"
            subtitle="Expanding beyond the capital  -  now serving five districts nationwide."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outside.map((o, i) => (
              <OutletCard key={o.name} outlet={o} i={i} />
            ))}
          </div>
          <Reveal className="mt-12">
            <div className="rounded-3xl bg-white p-6 text-sm text-neutral-600 shadow-card">
              Khilgaon, Wari, South Banasree and Shonir Akhra branches are permanently closed  -  please
              visit our other locations or use the ordering platform.
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact form */}
      <section className="section-pad bg-white">
        <div className="container-kudos grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle
              align="left"
              kicker="Let’s Have a Talk"
              title="Questions, feedback or bulk orders?"
              subtitle="Send us a message and the KUDOS team will get back to you. Prefer to talk? Call us at the number below."
            />
            <div className="mt-8 space-y-4">
              <p className="flex items-center gap-3 font-heading font-semibold text-maroon">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                </span>
                <a href={info.phoneHref} className="transition-colors hover:text-orange">{info.phone}</a>
              </p>
              <p className="flex items-center gap-3 font-heading font-semibold text-maroon">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <a href={`mailto:${info.email}`} className="break-all transition-colors hover:text-orange">{info.email}</a>
              </p>
              <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                <p className="font-heading font-semibold text-maroon">Opening Hours</p>
                {info.hours.map((h) => (
                  <p key={h.days} className="mt-2">
                    {h.days}: {h.open}  -  {h.close}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <Reveal delay={0.1}>
            <form
              className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-maroon/10 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h3 className="font-heading text-xl font-bold text-maroon">Send us a message</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+880-1X-XXXXXXX"
                    className="w-full rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block font-heading text-sm font-semibold text-neutral-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-xl border border-maroon/15 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                />
              </div>
              <button type="submit" className="btn-brand mt-6 w-full sm:w-auto">
                {sent ? 'Message Sent ✓' : 'Send Message'}
              </button>
              {sent && (
                <p role="status" className="mt-3 text-sm font-medium text-maroon">
                  Thank you! We’ll get back to you shortly. For urgent orders, please call us.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default OutletLocation;