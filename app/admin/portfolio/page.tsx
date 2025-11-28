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
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";
import AdminLayout from "@/components/AdminLayout";

// --- Types ---
type Category =
  | "House Cleaning"
  | "Office Cleaning"
  | "Deep Cleaning"
  | "Before/After";

interface PortfolioItem {
  id: string;
  title?: string | null;
  description?: string | null;
  category: string;
  images: string[];
  likes: number;
  createdAt: Date;
}

interface FormData {
  title: string;
  description: string;
  category: Category | "";
  images: string[];
}

const categories: Category[] = [
  "House Cleaning",
  "Office Cleaning",
  "Deep Cleaning",
  "Before/After",
];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    images: [],
  });

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Open create modal
  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", category: "", images: [] });
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category as Category,
      images: item.images,
    });
    setIsModalOpen(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.category || formData.images.length === 0) {
      alert("Category and at least one image are required");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingItem
        ? `/api/portfolio/${editingItem.id}`
        : "/api/portfolio";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchItems();
        setIsModalOpen(false);
      } else {
        alert("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchItems();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
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
                Portfolio Management
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Manage your portfolio items and showcase your work
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20 text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Item
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-400 text-base sm:text-lg mb-3 sm:mb-4">
                No portfolio items yet
              </p>
              <button
                onClick={openCreateModal}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm sm:text-base"
              >
                Create your first item
              </button>
            </div>
          )}

          {/* Items Grid */}
          {!isLoading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-cyan-500/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.images[0]}
                      alt={item.title || "Portfolio item"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                    {/* Actions */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-sm rounded-md sm:rounded-lg text-white hover:bg-cyan-500 transition-colors"
                        aria-label="Edit item"
                      >
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 sm:p-2 bg-slate-900/90 backdrop-blur-sm rounded-md sm:rounded-lg text-white hover:bg-red-500 transition-colors"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 truncate">
                      {item.title || "Untitled"}
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-400 mb-1 sm:mb-2">
                      {item.category}
                    </p>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/5 text-xs text-slate-500">
                      <span>{item.images.length} image(s)</span>
                      <span>{item.likes} likes</span>
                    </div>
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
                      {editingItem
                        ? "Edit Portfolio Item"
                        : "Create Portfolio Item"}
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
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm sm:text-base"
                        placeholder="Enter title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as Category,
                          })
                        }
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm sm:text-base"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        Images *
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
                        isSaving ||
                        !formData.category ||
                        formData.images.length === 0
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
                          {editingItem ? "Update" : "Create"}
                        </>
                      )}
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
