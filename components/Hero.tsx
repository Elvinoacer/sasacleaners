"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, ShieldCheck } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  animate,
  useMotionValue,
} from "framer-motion";

// --- Sub-component for Animated Numbers ---
function Counter({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: any;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return (
    <div className="flex flex-col items-center sm:items-start p-3 sm:p-4 backdrop-blur-sm bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300 w-full">
      <div className="flex items-center gap-2 mb-2 text-primary/80">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          {rounded}
        </motion.span>
        <span className="text-lg sm:text-xl text-primary font-bold">+</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium text-center sm:text-left">
        {label}
      </p>
    </div>
  );
}

// --- Main Hero Component ---
export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center overflow-hidden bg-slate-950">
      {/* Dynamic Background with Parallax */}
      <motion.div
        className="absolute inset-0 z-0 select-none"
        style={{ y: y1 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80"
          alt="Pristine interior background"
          fill
          priority
          className="object-cover opacity-90 scale-105"
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </motion.div>

      {/* Main Content */}
      <div className="container relative z-10 px-4 sm:px-6 mx-auto w-full">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Text */}
          <div className="max-w-2xl mx-auto lg:mx-0 w-full">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6 sm:mb-8 ring-1 ring-white/10 w-full sm:w-auto justify-center lg:justify-start"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-cyan-200 uppercase text-center lg:text-left">
                Premium Cleaning Services
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-white leading-[1.1] tracking-tight text-center lg:text-left"
            >
              Your Space,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x bg-[length:200%_auto] block sm:inline">
                Spotlessly
              </span>{" "}
              Clean.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 max-w-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0"
            >
              We don't just clean; we curate environments. Transform your home
              or office into a pristine sanctuary designed for clarity and
              comfort.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16 items-center lg:items-start"
            >
              <Link
                href="/contact"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-950 font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto text-center"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Get a Free Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/portfolio"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm w-full sm:w-auto text-center"
              >
                View Our Work
              </Link>
            </motion.div>

            {/* Glassmorphism Stats Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 border-t border-white/10 pt-6 sm:pt-8"
            >
              <Counter value={500} label="Happy Clients" icon={Star} />
              <Counter value={5000} label="Spaces Cleaned" icon={Sparkles} />
              <Counter value={100} label="Satisfaction" icon={ShieldCheck} />
            </motion.div>
          </div>

          {/* Right Column: Visual Balance - Hidden on mobile, shown on lg+ */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:block relative h-full min-h-[500px] xl:min-h-[600px]"
          >
            {/* Optional: Add a decorative element or secondary image here */}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Blur Elements - Adjusted for mobile */}
      <div className="absolute top-[-20%] sm:top-[-10%] right-[-10%] sm:right-[-5%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] sm:bottom-[-10%] left-[-10%] sm:left-[-5%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
    </section>
  );
}
