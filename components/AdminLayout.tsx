"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  ImageIcon,
  Briefcase,
  Star,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, ReactNode, useEffect } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detect when a modal is open by checking for z-[100] elements
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('[class*="z-[100]"]');
      setIsModalOpen(!!modal);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: "Portfolio",
      href: "/admin/portfolio",
      icon: ImageIcon,
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "Services",
      href: "/admin/services",
      icon: Briefcase,
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: Star,
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquare,
      color: "from-red-500 to-pink-600",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed top-[-10%] right-[-5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2.5 sm:p-3 bg-slate-900 border border-white/10 rounded-lg sm:rounded-xl text-white hover:bg-slate-800 transition-colors shadow-lg"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 transition-transform duration-300 ${
          isModalOpen
            ? "-translate-x-full"
            : isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4 sm:p-5 lg:p-6">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 sm:gap-3 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-xs text-slate-400">SaSa Cleaners</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all group ${
                      active
                        ? "bg-gradient-to-r " +
                          item.color +
                          " text-white shadow-lg"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg sm:rounded-xl"
                        style={{
                          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                          opacity: 0.1,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all border border-white/10 text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 relative z-10 min-h-screen">{children}</main>
    </div>
  );
}
