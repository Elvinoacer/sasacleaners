"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  LayoutDashboard,
  ImageIcon,
  Briefcase,
  MessageSquare,
  Mail,
  TrendingUp,
  Users,
  Star,
  Heart,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface Stats {
  services: number;
  portfolioItems: number;
  pendingTestimonials: number;
  unreadInquiries: number;
  totalLikes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Services",
      value: stats?.services || 0,
      icon: Briefcase,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      link: "/admin/services",
    },
    {
      title: "Portfolio Items",
      value: stats?.portfolioItems || 0,
      icon: ImageIcon,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      link: "/admin/portfolio",
    },
    {
      title: "Pending Testimonials",
      value: stats?.pendingTestimonials || 0,
      icon: Star,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      link: "/admin/testimonials",
    },
    {
      title: "Unread Inquiries",
      value: stats?.unreadInquiries || 0,
      icon: Mail,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      link: "/admin/inquiries",
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      link: "/admin/portfolio",
    },
  ];

  const quickActions = [
    {
      title: "Add Portfolio Item",
      description: "Showcase your latest work",
      icon: ImageIcon,
      color: "from-cyan-500 to-blue-600",
      link: "/admin/portfolio",
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Plus,
      color: "from-purple-500 to-pink-600",
      link: "/admin/services",
    },
    {
      title: "Review Testimonials",
      description: "Approve pending testimonials",
      icon: CheckCircle,
      color: "from-yellow-500 to-orange-600",
      link: "/admin/testimonials",
    },
    {
      title: "Check Inquiries",
      description: "View new contact messages",
      icon: Mail,
      color: "from-green-500 to-emerald-600",
      link: "/admin/inquiries",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Welcome back! Here's what's happening with your cleaning service.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="space-y-6 sm:space-y-8">
            {/* Statistics Cards */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Link href={stat.link} key={stat.title}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 ${stat.bgColor} border ${stat.borderColor} hover:border-opacity-50 transition-all cursor-pointer overflow-hidden min-h-[100px] sm:min-h-[120px]`}
                      >
                        {/* Background Gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />

                        <div className="relative h-full flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                            {stat.value > 0 && (
                              <span
                                className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${stat.color} text-white font-bold flex-shrink-0`}
                              >
                                {stat.value}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                              {stat.value}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-tight">
                              {stat.title}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link href={action.link} key={action.title}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden min-h-[120px] sm:min-h-[140px]"
                      >
                        {/* Hover Gradient */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                        />

                        <div className="relative h-full flex flex-col justify-between">
                          <div
                            className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${action.color} mb-3 sm:mb-4 shadow-lg w-fit`}
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors leading-tight">
                              {action.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-tight">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Management Cards */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Content Management
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Link href="/admin/portfolio">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 bg-slate-900/50 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">
                          Portfolio Gallery
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                          Manage your work showcase with images and categories
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                          <span className="text-purple-400 font-bold">
                            {stats?.portfolioItems || 0} items
                          </span>
                          <span className="text-slate-500 hidden sm:inline">
                            •
                          </span>
                          <span className="text-pink-400 font-bold">
                            {stats?.totalLikes || 0} likes
                          </span>
                        </div>
                      </div>
                      <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400/30 group-hover:text-purple-400/50 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>

                <Link href="/admin/services">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-400 transition-colors">
                          Services Offered
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                          Create and update your service listings with pricing
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                          <span className="text-cyan-400 font-bold">
                            {stats?.services || 0} services
                          </span>
                        </div>
                      </div>
                      <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>

                <Link href="/admin/testimonials">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 bg-slate-900/50 border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-400 transition-colors">
                          Testimonials
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                          Approve and manage customer feedback and reviews
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                          {stats && stats.pendingTestimonials > 0 ? (
                            <span className="flex items-center gap-1 text-yellow-400 font-bold">
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              {stats.pendingTestimonials} pending
                            </span>
                          ) : (
                            <span className="text-green-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="hidden sm:inline">
                                All reviewed
                              </span>
                              <span className="sm:hidden">Reviewed</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-400/30 group-hover:text-yellow-400/50 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>

                <Link href="/admin/inquiries">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="group relative rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 bg-slate-900/50 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-green-400 transition-colors">
                          Contact Inquiries
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                          View and respond to customer contact form submissions
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                          {stats && stats.unreadInquiries > 0 ? (
                            <span className="flex items-center gap-1 text-green-400 font-bold">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              {stats.unreadInquiries} unread
                            </span>
                          ) : (
                            <span className="text-slate-500 font-bold text-xs sm:text-sm">
                              <span className="hidden sm:inline">
                                No new inquiries
                              </span>
                              <span className="sm:hidden">No new</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400/30 group-hover:text-green-400/50 transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
