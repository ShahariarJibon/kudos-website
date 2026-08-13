import { SITE } from '../data/site';

/**
 * KUDOS logo  -  official brand mark (logo.png), transparent background.
 * Works on white navbar, light drawer and maroon footer.
 */
export default function Logo({ className = '', alt }) {
  return (
    <img
      src="/images/logo.png"
      alt={alt || `${SITE.name} logo`}
      width={1254}
      height={1254}
      decoding="async"
      className={`h-14 w-auto shrink-0 sm:h-16 ${className}`}
    />
  );
}