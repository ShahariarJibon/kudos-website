import { Link } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../data/site';
import { useBusinessInfo } from '../services/publicData';
import Logo from './Logo';

const socialIcon = {
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.6-1.6H16.4V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.5v3h2.5v7h3.5z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  ),
};

/**
 * Footer — maroon dark band with brand info, links, hours and contact.
 */
export default function Footer() {
  const info = useBusinessInfo();

  return (
    <footer className="bg-maroon text-white">
      <div className="container-kudos grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" aria-label="KUDOS — go to homepage">
            <Logo />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Bangladeshi fast food chain, established 2020. Wide variety of flavour-filled, high
            quality meals at affordable deals. {SITE.tagline}.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {Object.entries(info.socials).map(([key, social]) => (
              <a
                key={key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`KUDOS on ${social.label}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-orange hover:shadow-glow"
              >
                {socialIcon[key]}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-orange">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex min-h-[44px] items-center text-sm text-white/80 transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-orange">
            Opening Hours
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {info.hours.map((h) => (
              <li key={h.days} className="text-white/80">
                <p className="font-semibold text-white">{h.days}</p>
                <p>
                  {h.open} – {h.close}
                </p>
              </li>
            ))}
          </ul>
          <a
            href={SITE.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand mt-5"
            aria-label="Order Now on the KUDOS ordering platform"
          >
            Order Now
          </a>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-orange">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={info.phoneHref} className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                {info.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${info.email}`} className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {info.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 space-y-1.5 text-sm text-white/60">
            {info.hours.map((h) => (
              <p key={h.days}>
                {h.days}: {h.open} – {h.close}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-kudos flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>Copyright © KUDOS {new Date().getFullYear()} | All rights reserved.</p>
          <p>Developed by SilkCity Technology</p>
        </div>
      </div>
    </footer>
  );
}
