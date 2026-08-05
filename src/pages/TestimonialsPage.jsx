import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Reveal from '../components/ui/Reveal';
import TestimonialSlider from '../components/TestimonialSlider';
import { VIDEO_IDS } from '../data/testimonials';
import { useTestimonials } from '../services/publicData';

function TestimonialsPage() {
  const testimonials = useTestimonials();

  return (
    <>
      <PageHeader
        kicker="Testimonials"
        title="What our guests say"
        subtitle="Real words from real KUDOS lovers across Dhaka and beyond — from Facebook reviews to Google ratings."
      />

      <section className="section-pad bg-hero-gradient">
        <div className="container-kudos">
          <Reveal>
            <TestimonialSlider items={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* Video testimonials */}
      <section className="section-pad bg-white py-12">
        <div className="container-kudos">
          <SectionTitle
            kicker="Watch"
            title="Video testimonials"
            subtitle="Hear it straight from our guests."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {VIDEO_IDS.testimonials.map((id, i) => (
              <Reveal key={id} delay={i * 0.1}>
                <div className="aspect-video overflow-hidden rounded-2xl shadow-card ring-1 ring-maroon/5">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={`KUDOS video testimonial ${i + 1}`}
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
    </>
  );
}

export default TestimonialsPage;