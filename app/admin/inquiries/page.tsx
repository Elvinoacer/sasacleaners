"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  User,
  Briefcase,
  Loader2,
  MessageSquare,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, read: !currentStatus } : i))
      );

      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, read: currentStatus } : i))
        );
        alert("Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert("Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
        ? !inquiry.read
        : inquiry.read;

    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.service.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 xl:p-10 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                Inquiries
              </h1>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg">
                Manage and respond to client messages
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-xl min-w-[80px] sm:min-w-[100px]">
                <p className="text-xs sm:text-sm text-slate-400 mb-1">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {inquiries.length}
                </p>
              </div>
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/50 border border-green-500/20 backdrop-blur-xl min-w-[80px] sm:min-w-[100px]">
                <p className="text-xs sm:text-sm text-green-400 mb-1">Unread</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">
                  {inquiries.filter((i) => !i.read).length}
                </p>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900/50 rounded-xl sm:rounded-2xl border border-white/5 backdrop-blur-xl">
            {/* Search */}
            <div className="relative group sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-950/50 p-1 rounded-lg sm:rounded-xl border border-white/5 sm:col-span-2 lg:col-span-1">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 px-3 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-slate-800 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 sm:py-24 lg:py-32">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-cyan-400" />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 sm:py-24 lg:py-32 bg-slate-900/30 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/5 border-dashed"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-slate-900 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/5">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                  No inquiries found
                </h3>
                <p className="text-slate-400 text-sm sm:text-base px-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "New inquiries will appear here"}
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredInquiries.map((inquiry, index) => (
                    <motion.div
                      key={inquiry.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                        inquiry.read
                          ? "bg-slate-900/40 border-white/5 hover:border-white/10"
                          : "bg-slate-900/80 border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)]"
                      }`}
                    >
                      {/* Unread Indicator */}
                      {!inquiry.read && (
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500/20 to-transparent -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 blur-2xl pointer-events-none" />
                      )}

                      <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                        {/* Left Column: Info */}
                        <div className="lg:w-1/3 space-y-4 sm:space-y-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                inquiry.read
                                  ? "bg-slate-800 text-slate-400"
                                  : "bg-cyan-500/10 text-cyan-400"
                              }`}
                            >
                              {inquiry.read ? (
                                <MailOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                              ) : (
                                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`text-base sm:text-lg font-bold mb-1 truncate ${
                                  !inquiry.read
                                    ? "text-white"
                                    : "text-slate-300"
                                }`}
                              >
                                {inquiry.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {new Date(inquiry.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 sm:space-y-3">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-950/50 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group/link"
                            >
                              <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-slate-900 text-slate-400 group-hover/link:text-cyan-400 transition-colors flex-shrink-0">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <span className="text-xs sm:text-sm text-slate-300 truncate flex-1">
                                {inquiry.email}
                              </span>
                            </a>

                            <a
                              href={`tel:${inquiry.phone}`}
                              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-950/50 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all group/link"
                            >
                              <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-slate-900 text-slate-400 group-hover/link:text-green-400 transition-colors flex-shrink-0">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <span className="text-xs sm:text-sm text-slate-300 truncate flex-1">
                                {inquiry.phone}
                              </span>
                            </a>

                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-slate-950/50 border border-white/5">
                              <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-slate-900 text-slate-400 flex-shrink-0">
                                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                              <span className="text-xs sm:text-sm text-slate-300 truncate flex-1">
                                {inquiry.service}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Message & Actions */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-slate-950/30 border border-white/5 mb-4 sm:mb-6">
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-h-32 sm:max-h-48 overflow-y-auto">
                              {inquiry.message}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                            <button
                              onClick={() =>
                                handleToggleRead(inquiry.id, inquiry.read)
                              }
                              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none ${
                                inquiry.read
                                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                              }`}
                            >
                              {inquiry.read ? (
                                <>
                                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">Mark Unread</span>
                                </>
                              ) : (
                                <>
                                  <MailOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">Mark Read</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex-1 sm:flex-none"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
