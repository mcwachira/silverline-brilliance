

export function BlogHero() {
  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-12 md:py-20 lg:py-28"
      aria-labelledby="blog-hero-heading"
    >
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="dot-pattern h-full w-full" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" aria-hidden="true" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 
          id="blog-hero-heading"
          className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6"
        >
          Our Blog
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
          Insights, updates, and stories from the Silverline Technologies team.
          Explore the latest in technology and innovation.
        </p>
      </div>
    </section>
  );
}