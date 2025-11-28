"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from 'react'
import { toast } from 'sonner';

// --- Reusable Animated Link Component ---
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors w-fit"
  >
    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
    </span>
  </Link>
);

// --- Social Icon Component ---
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <Link
    href={href}
    className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500 hover:border-cyan-500 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
  >
    <Icon className="w-4 h-4" />
  </Link>
);

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.status === 409) {
        toast.info(data.message)
      } else if (res.ok) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <footer className="relative bg-slate-950 pt-12 sm:pt-16 lg:pt-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        {/* 1. Pre-Footer CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="relative mb-12 sm:mb-16 lg:mb-20 p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 sm:p-8 lg:p-12 opacity-5">
            <Sparkles className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ready for a <span className="text-cyan-400">Spotless</span>{" "}
                Transformation?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0">
                Join 500+ happy clients. Get your free quote today and
                experience the difference of a professional touch.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 text-sm sm:text-base text-center"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/portfolio"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors text-sm sm:text-base text-center"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16">
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                SaSa <span className="text-cyan-400">Cleaners</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm">
              Elevating hygiene standards for homes and offices. We blend
              advanced cleaning tech with eco-friendly solutions for a space
              that breathes.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <SocialIcon href="#" icon={Instagram} />
              <SocialIcon href="#" icon={Twitter} />
              <SocialIcon href="#" icon={Linkedin} />
              <SocialIcon href="#" icon={Facebook} />
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Company
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <FooterLink href="/testimonials">Testimonials</FooterLink>
              </li>
              <li>
                <FooterLink href="/services">Services</FooterLink>
              </li>
              <li>
                <FooterLink href="/portfolio">Our Work</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Services (Span 2) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Services
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <FooterLink href="/portfolio?category=House Cleaning">
                  House Cleaning
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/portfolio?category=Office Cleaning">
                  Office Cleaning
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/portfolio?category=Deep Cleaning">
                  Deep Cleaning
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/portfolio?category=Before/After">
                  Before & After
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact (Span 4) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Stay Updated
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              Subscribe to our newsletter for cleaning tips and exclusive
              offers.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>


            <div className="pt-4 sm:pt-6 border-t border-white/10 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-sm sm:text-base">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                <span>+254 794 636 982</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-sm sm:text-base">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                <span className="break-all">duncanjuma.info@gmail.com</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-slate-400 text-sm sm:text-base">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>PO BOX 20100, Nakuru, Kenlands, Jua Lako</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Copyright Bar */}
        <div className="py-6 sm:py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
          <p className="text-center sm:text-left">
            &copy; {currentYear} SaSa Cleaners. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6 text-xs">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
