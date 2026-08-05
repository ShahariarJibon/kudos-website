import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import LazyImage from '../components/ui/LazyImage';
import { ALL_ITEMS } from '../data/menu';
import { VIDEO_IDS } from '../data/testimonials';

// Build gallery from menu imagery + hero + flagship shots
const GALLERY_IMAGES = [
  { src: '/images/hero-burger.png', alt: 'KUDOS signature burger', category: 'Food' },
  ...ALL_ITEMS.map((it) => ({ src: it.image, alt: it.name, category: it.category })),
  { src: '/images/about-flagship.jpg', alt: 'KUDOS flagship branch', category: 'Outlet' },
  { src: '/images/kudocafe-menu.jpg', alt: 'KudoCafe menu', category: 'Cafe' },
];

function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (dir) =>
      setLightboxIndex((i) => (i === null ? i : (i + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)),
    []
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, step, close]);

  return (
    <>
      <PageHeader
        kicker="Gallery"
        title="Gallery"
        subtitle="A glimpse inside KUDOS — sizzling dishes from the live kitchen and the vibe of our outlets across Bangladesh."
      />

      {/* Video showcase */}
      <section className="section-pad bg-hero-gradient pt-10">
        <div className="container-kudos">
          <Reveal className="mb-10">
            <h2 className="text-center font-heading text-2xl font-extrabold text-maroon sm:text-3xl">KUDOS in action</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {VIDEO_IDS.gallery.map((id, i) => (
              <Reveal key={id} delay={i * 0.1}>
                <div className="aspect-video overflow-hidden rounded-2xl shadow-card ring-1 ring-maroon/5">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={`KUDOS video ${i + 1}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image grid */}
      <section className="section-pad py-10">
        <div className="container-kudos">
          <SectionTitle
            kicker="Moments"
            title="Food & Outlets"
            subtitle="Tap any photo to view it full size."
          />
          <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:_balance]">
            {GALLERY_IMAGES.map((g, i) => (
              <Reveal key={g.src + i} delay={(i % 4) * 0.05} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View ${g.alt} full size`}
                  className="group block w-full overflow-hidden rounded-xl shadow-card ring-1 ring-maroon/5"
                >
                  <LazyImage
                    src={g.src}
                    alt={g.alt}
                    className={`w-full ${i % 3 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}
                    imgClassName="transition-transform duration-500 group-hover:scale-110"
                    width={600}
                    height={i % 3 === 0 ? 600 : 800}
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <LazyImage
                src={GALLERY_IMAGES[lightboxIndex].src}
                alt={GALLERY_IMAGES[lightboxIndex].alt}
                className="max-h-[78vh] w-auto"
                imgClassName="h-full w-full max-h-[78vh] object-contain rounded-lg"
                eager
              />
              <figcaption className="mt-3 text-center text-white/90">
                {GALLERY_IMAGES[lightboxIndex].alt} · {lightboxIndex + 1}/{GALLERY_IMAGES.length}
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GalleryPage;