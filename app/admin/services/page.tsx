"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Sparkles,
  Loader2,
  Briefcase,
  Eye,
} from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import AdminLayout from "@/components/AdminLayout";
import ServiceDetailModal from "@/components/ServiceDetailModal";

interface Service {
  id: string;
  title: string;
  description: string;
  price?: string | null;
  icon?: string | null;
  images: string[];
  features: string[];
  createdAt: Date;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  icon: string;
  images: string[];
  features: string[];
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    icon: "",
    images: [],
    features: [],
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Open create modal
  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      icon: "",
      images: [],
      features: [],
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || "",
      icon: service.icon || "",
      images: service.images || [],
      features: service.features || [],
    });
    setIsModalOpen(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Title and description are required");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchServices();
        setIsModalOpen(false);
      } else {
        alert("Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchServices();
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Services Management
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Manage your cleaning service offerings
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Service
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && services.length === 0 && (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-400 text-base sm:text-lg mb-3 sm:mb-4">
                No services yet
              </p>
              <button
                onClick={openCreateModal}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm sm:text-base"
              >
                Create your first service
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && services.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  {/* Image or Placeholder */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                    {service.images && service.images.length > 0 ? (
                      <Image
                        src={service.images[0]}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-cyan-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                    {/* Actions */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreviewService(service)}
                        className="p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-sm rounded-md sm:rounded-lg text-white hover:bg-blue-500 transition-colors"
                        title="Preview"
                        aria-label="Preview service"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-sm rounded-md sm:rounded-lg text-white hover:bg-cyan-500 transition-colors"
                        title="Edit"
                        aria-label="Edit service"
                      >
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-sm rounded-md sm:rounded-lg text-white hover:bg-red-500 transition-colors"
                        title="Delete"
                        aria-label="Delete service"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 truncate">
                      {service.title}
                    </h3>
                    {service.price && (
                      <p className="text-xs sm:text-sm text-cyan-400 mb-1 sm:mb-2 font-semibold">
                        {service.price}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Create/Edit Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/90 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="w-full max-w-sm sm:max-w-md lg:max-w-2xl bg-slate-900 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[95vh] mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-white/10 shrink-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      {editingService ? "Edit Service" : "Create Service"}
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
                  <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm sm:text-base"
                        placeholder="e.g., Deep House Cleaning"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] text-sm sm:text-base"
                        placeholder="Describe the service..."
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Price (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm sm:text-base"
                        placeholder="e.g., Starting at KSh 5,000"
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Features
                      </label>
                      <div className="space-y-2 sm:space-y-3">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...formData.features];
                                newFeatures[index] = e.target.value;
                                setFormData({
                                  ...formData,
                                  features: newFeatures,
                                });
                              }}
                              className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm sm:text-base"
                              placeholder="e.g., Deep cleaning of all surfaces"
                            />
                            <button
                              onClick={() => {
                                const newFeatures = formData.features.filter(
                                  (_, i) => i !== index
                                );
                                setFormData({
                                  ...formData,
                                  features: newFeatures,
                                });
                              }}
                              className="p-1.5 sm:p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md sm:rounded-lg transition-colors flex-shrink-0"
                              aria-label="Remove feature"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              features: [...formData.features, ""],
                            })
                          }
                          className="flex items-center gap-2 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          Add Feature
                        </button>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Service Images (Optional)
                      </label>
                      <ImageUpload
                        value={formData.images}
                        onChange={(urls) =>
                          setFormData({ ...formData, images: urls })
                        }
                        maxFiles={5}
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 border-t border-white/10 shrink-0 bg-slate-900 rounded-b-xl sm:rounded-b-2xl">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-slate-300 hover:bg-white/5 transition-colors text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={
                        isSaving || !formData.title || !formData.description
                      }
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          {editingService ? "Update" : "Create"}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Modal */}
          {previewService && (
            <ServiceDetailModal
              service={previewService}
              isOpen={!!previewService}
              onClose={() => setPreviewService(null)}
              showBookButton={false}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
