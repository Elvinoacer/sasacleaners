"use client";

import { Check, Award, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Certified Professionals",
    description: "All our cleaners are trained, vetted, and certified",
  },
  {
    icon: Users,
    title: "500+ Happy Clients",
    description: "Join our growing community of satisfied customers",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "We work around your schedule for maximum convenience",
  },
];

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-background border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-xl max-w-[280px] sm:max-w-xs">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-xl sm:text-2xl">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Satisfaction Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                SaSa Cleaners
              </span>
              ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
              We're not just another cleaning service. We're your partners in
              creating healthier, happier spaces. With years of experience and a
              commitment to excellence, we deliver results that exceed
              expectations.
            </p>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-3 sm:gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm sm:text-base"
              >
                Get Started
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-border text-foreground font-semibold rounded-lg hover:border-foreground hover:bg-accent transition-colors duration-200 text-sm sm:text-base"
              >
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
