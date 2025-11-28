"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, ChevronRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Dynamic Scroll Handling
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 50 && latest > previous) {
      setIsScrolled(true);
    } else if (latest < 50) {
      setIsScrolled(false);
    }
  });

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 inset-x-0 z-50 h-16 sm:h-20 transition-all duration-300 ease-in-out border-b",
          isScrolled || isMenuOpen
            ? "bg-slate-950/95 backdrop-blur-md border-white/10 shadow-lg"
            : "bg-transparent border-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container h-full flex items-center justify-between px-4 sm:px-6 mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group relative z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
              SaSa <span className="text-cyan-400">Cleaners</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1.5 border border-white/10 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  )}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  {/* The Floating Pill Background Effect */}
                  {hoveredPath === link.href && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {isActive && !hoveredPath && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-slate-950 text-sm font-bold hover:bg-cyan-50 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] whitespace-nowrap"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 p-1.5 sm:p-2 text-slate-200 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950 md:hidden pt-16 sm:pt-20 px-4 sm:px-6 flex flex-col overflow-y-auto"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -z-10 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-[60px] sm:blur-[80px]" />
            <div className="absolute bottom-0 left-0 -z-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-[60px] sm:blur-[80px]" />

            <div className="flex flex-col space-y-1 sm:space-y-2 mt-4 sm:mt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "group flex items-center justify-between py-3 sm:py-4 border-b border-white/5 text-base sm:text-lg font-medium transition-colors",
                      pathname === link.href
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 mb-8"
            >
              <Link
                href="/contact"
                className="flex items-center justify-center w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Get a Free Quote
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
