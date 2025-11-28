"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  ZoomIn,
  Sparkles,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// --- Types & Data ---
type Category =
  | "All"
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

const categories: Category[] = [
  "All",
  "House Cleaning",
  "Office Cleaning",
  "Deep Cleaning",
  "Before/After",
];

// --- Components ---

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}

function PortfolioContent() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(
    null
  );
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;

  useEffect(() => {
    if (initialCategory && categories.includes(initialCategory)) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Load liked items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("portfolioLikes");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLikedItems(new Set(parsed));
      } catch (error) {
        console.error("Error loading likes from localStorage:", error);
      }
    }
  }, []);

  // Fetch portfolio items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setPortfolioItems(data);
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter Logic
  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  // Handlers
  const toggleLike = async (id: string) => {
    const isLiked = likedItems.has(id);
    const newSet = new Set(likedItems);

    if (isLiked) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    setLikedItems(newSet);

    // Save to localStorage
    localStorage.setItem("portfolioLikes", JSON.stringify(Array.from(newSet)));

    // Update backend
    try {
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/portfolio/${id}/like`, { method });

      if (res.ok) {
        const updatedItem = await res.json();
        // Update the local portfolio items with new likes count
        setPortfolioItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, likes: updatedItem.likes } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert on error
      setLikedItems(likedItems);
      localStorage.setItem(
        "portfolioLikes",
        JSON.stringify(Array.from(likedItems))
      );
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* 1. Ambient Background */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-blue-600/10 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-cyan-500/10 rounded-full blur-[50px] sm:blur-[70px] lg:blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        {/* 2. Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 sm:mb-6"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              Curated Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight"
          >
            Our Work{" "}
            <span className="block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                Speaks Volumes
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Explore a gallery of transformed spaces. From high-rise offices to
            cozy family homes, witness the clarity we bring.
          </motion.p>
        </div>

        {/* 3. Animated Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-8 sm:mb-10 lg:mb-12 px-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="relative px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  selectedCategory === category
                    ? "text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <p className="text-slate-400 text-base sm:text-lg">
              No portfolio items found
            </p>
          </div>
        )}

        {/* 4. Masonry-style Grid with Layout Animations */}
        {!isLoading && filteredItems.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-white/5 cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.images[0]}
                      alt={item.title || "Portfolio item"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-2 sm:p-3 rounded-full border border-white/30 text-white">
                        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      </div>
                    </div>

                    {/* Top Right Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 p-1.5 sm:p-2 lg:p-2.5 rounded-full bg-slate-950/30 backdrop-blur-md border border-white/10 hover:bg-slate-950/50 transition-all z-20 group/btn"
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-all duration-300 ${
                          likedItems.has(item.id)
                            ? "fill-rose-500 text-rose-500 scale-110"
                            : "text-white group-hover/btn:scale-110"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4 lg:p-5 relative z-10 bg-slate-900">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {item.title || "Untitled"}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-400 mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-white/5">
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        {item.likes} Likes
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" />
                        Verified Clean
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 5. Full Screen Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50">
                <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl bg-slate-900 border border-white/10 mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video w-full bg-slate-800">
                  <Image
                    src={selectedImage.images[0]}
                    alt={selectedImage.title || "Portfolio item"}
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                </div>

                <div className="p-4 sm:p-5 lg:p-6 xl:p-8 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 bg-slate-900">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 truncate">
                      {selectedImage.title || "Untitled"}
                    </h2>
                    <p className="text-cyan-400 font-medium text-sm sm:text-base">
                      {selectedImage.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => toggleLike(selectedImage.id)}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors border border-white/5 text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                          likedItems.has(selectedImage.id)
                            ? "fill-rose-500 text-rose-500"
                            : ""
                        }`}
                      />
                      {likedItems.has(selectedImage.id) ? "Liked" : "Like"}
                    </button>

                    <a
                      href="/contact"
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-white text-slate-950 font-bold hover:bg-cyan-50 transition-colors text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                    >
                      Book Similar
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. CTA Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 xl:mt-32">
          <div className="relative rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient-x" />
            <div className="relative bg-slate-950 rounded-[18px] sm:rounded-[22px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 xl:py-20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 relative z-10">
                Ready to transform your space?
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 relative z-10 px-2 sm:px-0">
                Join our list of satisfied clients. Book your consultation today
                and experience the difference of professional care.
              </p>

              <a
                href="/contact"
                className="relative z-10 inline-flex items-center gap-2 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-white text-slate-950 rounded-full font-bold hover:scale-105 transition-transform text-sm sm:text-base"
              >
                Get Started
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
