"use client";
import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Kimani",
    role: "Event Director",
    company: "Nairobi Events Co.",
    content:
      "Silverline Technologies transformed our annual gala into an unforgettable experience. Their lighting and sound setup was absolutely world-class. Highly recommended!",
    rating: 5,
    image: "SK",
  },
  {
    id: 2,
    name: "James Ochieng",
    role: "Marketing Manager",
    company: "TechStart Kenya",
    content:
      "Professional team, state-of-the-art equipment, and exceptional service. Our product launch was a massive success thanks to their live streaming expertise.",
    rating: 5,
    image: "JO",
  },
  {
    id: 3,
    name: "Grace Muthoni",
    role: "Wedding Planner",
    company: "Dream Weddings",
    content:
      "They captured every beautiful moment of the weddings we organize. The photography and videography quality exceeded our expectations every single time.",
    rating: 5,
    image: "GM",
  },
  {
    id: 4,
    name: "David Karanja",
    role: "CEO",
    company: "Corporate Solutions Ltd",
    content:
      "Silverline has been our go-to AV partner for all corporate events. Their hybrid conferencing solutions helped us reach global audiences seamlessly.",
    rating: 5,
    image: "DK",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold uppercase tracking-widest mb-4">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Card */}
          <div className="relative">
            <div
              key={currentIndex}
              className="glass-card rounded-2xl p-8 md:p-12 text-center transition-all duration-500 ease-in-out"
            >
              <Quote className="w-12 h-12 text-accent/30 mx-auto mb-6" />

              <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({
                  length: testimonials[currentIndex].rating,
                }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-accent text-lg">
                    {testimonials[currentIndex].image}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-foreground">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {testimonials[currentIndex].role},{" "}
                    {testimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-accent w-8"
                    : "bg-muted hover:bg-accent/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
