"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Sparkles,
  Package,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Data Configuration ---
const services = [
  {
    icon: Home,
    title: "House Cleaning",
    description:
      "Detailed residential sanitation including kitchens, bathrooms, and living areas.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    price: "$80+",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "group-hover:border-cyan-400/50",
  },
  {
    icon: Briefcase,
    title: "Office Cleaning",
    description:
      "Boost productivity with a pristine, sanitized, and organized workspace.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    price: "$120+",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50",
  },
  {
    icon: Sparkles,
    title: "Deep Cleaning",
    description:
      "Intensive spring cleaning reaching every hidden corner and surface.",
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80",
    price: "$150+",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "group-hover:border-purple-400/50",
  },
  {
    icon: Package,
    title: "Move In/Out",
    description:
      "Ensure your deposit return or a fresh start with our turnover service.",
    image:
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
    price: "$200+",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "group-hover:border-emerald-400/50",
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function ServiceHighlights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-slate-950 overflow-hidden">
      {/* Background Decor (Subtle Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] sm:h-[400px] lg:h-[500px] bg-cyan-500/5 blur-[60px] sm:blur-[80px] lg:blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              Our Expertise
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight"
          >
            Cleaning Solutions{" "}
            <span className="block sm:inline">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Tailored to Perfection
              </span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed px-4 sm:px-0"
          >
            From cozy apartments to sprawling corporate offices, we bring a
            level of detail that transforms spaces into sanctuaries.
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                variants={cardVariants}
                key={service.title}
                className="h-full"
              >
                {/* Card Container */}
                <div
                  className={`
                  group relative h-full flex flex-col
                  bg-slate-900/40 backdrop-blur-sm 
                  border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden
                  transition-all duration-500
                  hover:-translate-y-1 sm:hover:-translate-y-2 hover:bg-slate-900/60
                  ${service.border} hover:border-opacity-50 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-cyan-900/10
                `}
                >
                  {/* Image Section */}
                  <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index < 2} // Prioritize loading first two images
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

                    {/* Floating Icon */}
                    <div
                      className={`
                      absolute bottom-3 left-3 sm:bottom-4 sm:left-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl 
                      backdrop-blur-md border border-white/10
                      ${service.bg} transition-colors duration-300
                    `}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${service.color}`}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-5 lg:p-6 pt-2 sm:pt-3 lg:pt-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-100 transition-colors pr-2">
                        {service.title}
                      </h3>
                      {/* Price Pill */}
                      <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white whitespace-nowrap flex-shrink-0">
                        {service.price}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4 sm:mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* Action Area */}
                    <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs">Available today</span>
                      </div>

                      <Link
                        href="/contact"
                        className="flex items-center gap-1.5 sm:gap-2 text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap"
                      >
                        Book Now
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 flex-shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 sm:mt-14 lg:mt-16"
        >
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-950 rounded-full font-bold overflow-hidden transition-all hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <span className="relative z-10">View Full Catalog</span>
            <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:rotate-45 flex-shrink-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
