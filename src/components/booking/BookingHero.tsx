export default function BookingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 py-20 md:py-28">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="dot-pattern h-full w-full" />
      </div>

      {/* Floating Elements */}
      <div className="floating-cloud absolute left-10 top-20 h-64 w-64 animate-float" />
      <div className="floating-cloud absolute right-20 top-40 h-48 w-48 animate-float-delayed" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Book Our Services
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-xl text-white/90 md:text-2xl">
            Let's make your event unforgettable
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm">Professional Team</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm">Quality Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </section>
  );
}
