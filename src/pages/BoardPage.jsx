import PageHeader from '../components/ui/PageHeader';
import Reveal from '../components/ui/Reveal';
import LazyImage from '../components/ui/LazyImage';
import { DIRECTORS } from '../data/directors';

function BoardPage() {
  return (
    <>
      <PageHeader
        kicker="Board of Directors"
        title="Board of Directors"
        subtitle="The team behind the KUDOS brand  -  four co-founders, one shared mission."
      />

      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTORS.map((d, i) => (
              <Reveal key={d.name} delay={(i % 4) * 0.1} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white text-center shadow-card ring-1 ring-maroon/5">
                  <div className="aspect-square shrink-0 overflow-hidden">
                    <LazyImage
                      src={d.image}
                      alt={`${d.name}, ${d.role} of KUDOS`}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-105"
                      width={512}
                      height={512}
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-6">
                    <h2 className="font-heading text-lg font-bold leading-snug text-maroon">{d.name}</h2>
                    <p className="mt-1 font-heading text-sm font-semibold text-orange">{d.role}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-widest text-neutral-400">{d.company}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-card sm:p-10">
              <h2 className="font-heading text-2xl font-extrabold text-maroon">Leading KUDOS into the future</h2>
              <p className="mt-4 text-neutral-600">
                With affordable deals, unswerving quality and a growing family of outlets, the KUDOS
                board continues to bring flavour-filled meals to every corner of Bangladesh.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default BoardPage;