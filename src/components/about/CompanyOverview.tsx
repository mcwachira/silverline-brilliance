import Image from 'next/image';
import heroImage from '@/src/assets/hero-av-equipment.jpg';

interface Stat {
  value: string;
  label: string;
  description?: string;
}

const stats: Stat[] = [
  { value: '10+', label: 'Years Experience', description: 'Industry expertise' },
  { value: '500+', label: 'Events Covered', description: 'Successful projects' },
  { value: '200+', label: 'Happy Clients', description: 'Satisfied customers' },
  { value: '50+', label: 'Team Members', description: 'Professional staff' },
];

export default function CompanyOverview() {
  return (
    <section className="bg-background py-20 md:py-28" aria-labelledby="overview-heading">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text Content */}
          <article className="space-y-6">
            <h2
              id="overview-heading"
              className="font-heading text-3xl font-bold text-gradient-gold md:text-4xl lg:text-5xl"
            >
              Silverline Technologies
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Silverline Technologies is a premier audiovisual services
                company delivering exceptional solutions for events,
                conferences, and corporate productions across Kenya and East
                Africa.
              </p>

              <p className="leading-relaxed">
                With over a decade of industry experience, we combine
                cutting-edge technology with creative expertise to transform
                your vision into reality. From intimate corporate gatherings to
                large-scale conferences, our professional team ensures flawless
                execution every time.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
                >
                  <div className="mb-2 font-heading text-4xl font-black text-accent transition-transform group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* Image */}
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Image
              src={heroImage}
              alt="Professional audiovisual technicians operating broadcast equipment and production control systems at Silverline Technologies"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </figure>
        </div>
      </div>
    </section>
  );
}