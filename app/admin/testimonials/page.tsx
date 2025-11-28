"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Eye,
  X,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";

interface Testimonial {
  id: string;
  name?: string | null;
  occupation?: string | null;
  rating: number;
  comment: string;
  imageUrl?: string | null;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    featured: false,
  });

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      console.log("Admin testimonials fetched:", data.length);
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (res.ok) {
        await fetchTestimonials();
      } else {
        alert("Failed to approve testimonial");
      }
    } catch (error) {
      console.error("Error approving testimonial:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: false }),
      });

      if (res.ok) {
        await fetchTestimonials();
      } else {
        alert("Failed to reject testimonial");
      }
    } catch (error) {
      console.error("Error rejecting testimonial:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTestimonials();
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const toggleFeatured = async (id: string, currentlyFeatured: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentlyFeatured }),
      });

      if (res.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const openEditModal = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      imageUrl: testimonial.imageUrl || "",
      featured: testimonial.featured,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingTestimonial) return;

    try {
      const res = await fetch(`/api/testimonials/${editingTestimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchTestimonials();
        setIsModalOpen(false);
      } else {
        alert("Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Error updating testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    activeTab === "pending" ? !t.approved : t.approved
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
        }`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              Testimonials Management
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Review, approve, and feature customer testimonials
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-sm ${
                activeTab === "pending"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Pending ({testimonials.filter((t) => !t.approved).length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-sm ${
                activeTab === "approved"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Approved ({testimonials.filter((t) => t.approved).length})
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredTestimonials.length === 0 && (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <p className="text-slate-400 text-base sm:text-lg">
                No {activeTab} testimonials
              </p>
            </div>
          )}

          {/* Testimonials Grid */}
          {!isLoading && filteredTestimonials.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden"
                >
                  {/* Featured Badge - Always Visible */}
                  <div className="p-3 sm:p-4 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400">
                      <div className="flex gap-0.5">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    {testimonial.featured ? (
                      <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">FEATURED</span>
                        <span className="sm:hidden">FTD</span>
                      </span>
                    ) : (
                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 text-slate-500 text-xs font-medium rounded-full border border-slate-700">
                        <span className="hidden sm:inline">Not Featured</span>
                        <span className="sm:hidden">Standard</span>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                    {/* User Info with Image */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      {testimonial.imageUrl ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden relative ring-1 sm:ring-2 ring-cyan-500/20 flex-shrink-0">
                          <Image
                            src={testimonial.imageUrl}
                            alt={testimonial.name || "User"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-slate-800 flex items-center justify-center border border-dashed border-slate-700 flex-shrink-0">
                          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm sm:text-base lg:text-lg truncate">
                          {testimonial.name || "Anonymous"}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 truncate">
                          {testimonial.occupation || "Customer"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="p-3 sm:p-4 bg-slate-800/30 rounded-lg sm:rounded-xl border border-white/5">
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-4 italic">
                        "{testimonial.comment}"
                      </p>
                    </div>

                    {/* Main Actions */}
                    {!testimonial.approved ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg sm:rounded-xl transition-colors font-medium text-xs sm:text-sm"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(testimonial.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg sm:rounded-xl transition-colors font-medium text-xs sm:text-sm"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => openEditModal(testimonial)}
                          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg sm:rounded-xl transition-colors font-medium text-xs sm:text-sm"
                        >
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            {testimonial.imageUrl
                              ? "Change Image"
                              : "Add Image"}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            toggleFeatured(testimonial.id, testimonial.featured)
                          }
                          className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-xs sm:text-sm ${
                            testimonial.featured
                              ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/40 hover:from-yellow-500 hover:to-orange-500 hover:text-white hover:border-yellow-500"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-cyan-500 hover:text-white hover:border-cyan-500"
                          }`}
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            {testimonial.featured
                              ? "Remove Featured"
                              : "Add Featured"}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Secondary Actions */}
                    <div className="pt-3 sm:pt-4 border-t border-white/5 flex gap-1.5 sm:gap-2">
                      {testimonial.approved && (
                        <button
                          onClick={() => handleReject(testimonial.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white rounded-md sm:rounded-lg transition-colors text-xs"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">Unapprove</span>
                          <span className="sm:hidden">Unapprove</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-md sm:rounded-lg transition-colors text-xs"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Edit Modal */}
          <AnimatePresence>
            {isModalOpen && editingTestimonial && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 lg:p-4 bg-slate-950/90 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="w-full max-w-sm sm:max-w-md lg:max-w-2xl bg-slate-900 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] sm:max-h-[95vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      Edit Testimonial
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
                    {/* Testimonial Info */}
                    <div className="p-3 sm:p-4 bg-slate-800 rounded-lg">
                      <p className="text-white font-semibold text-sm sm:text-base mb-1">
                        {editingTestimonial.name || "Anonymous"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 mb-2">
                        {editingTestimonial.occupation || "Customer"}
                      </p>
                      <div className="flex gap-1 mb-2">
                        {renderStars(editingTestimonial.rating)}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 italic">
                        "{editingTestimonial.comment}"
                      </p>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Profile Image
                      </label>
                      <ImageUpload
                        value={formData.imageUrl ? [formData.imageUrl] : []}
                        onChange={(urls) =>
                          setFormData({ ...formData, imageUrl: urls[0] || "" })
                        }
                        maxFiles={1}
                      />
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-800 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base">
                          Feature this testimonial
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Only featured testimonials with images appear on the
                          website
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            featured: !formData.featured,
                          })
                        }
                        className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors flex-shrink-0 ${
                          formData.featured ? "bg-cyan-500" : "bg-slate-700"
                        }`}
                        aria-label={
                          formData.featured
                            ? "Unfeature testimonial"
                            : "Feature testimonial"
                        }
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform ${
                            formData.featured
                              ? "translate-x-6 sm:translate-x-7"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 lg:p-6 border-t border-white/10 sticky bottom-0 bg-slate-900">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-slate-300 hover:bg-white/5 transition-colors text-sm sm:text-base order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-transform text-sm sm:text-base order-1 sm:order-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
