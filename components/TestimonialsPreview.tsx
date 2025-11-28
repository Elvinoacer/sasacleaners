"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    comment:
      "SaSa Cleaners transformed my home! Their attention to detail is incredible. Every corner sparkles and they are always on time.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "Michael Chen",
    role: "Office Manager",
    rating: 5,
    comment:
      "We've been using SaSa Cleaners for our office for over a year. Professional, reliable, and thorough. Highly recommended!",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    rating: 5,
    comment:
      "The best cleaning service I've worked with. They handle multiple properties for us and always exceed expectations.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
      <div className="container px-4 sm:px-6 mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Clients Say
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="card h-full relative bg-background border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Quote Icon */}
                <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 text-primary/20" />

                {/* Star Rating */}
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary flex-shrink-0"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-border">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm sm:text-base truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow"
          >
            Read More Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
