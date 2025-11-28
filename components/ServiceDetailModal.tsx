"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Package,
  Sofa,
  Wind,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Map icon names to components
const iconMap: { [key: string]: any } = {
  Home,
  Briefcase,
  Sparkles,
  Package,
  Sofa,
  Wind,
  Star,
};

interface Service {
  id: string;
  title: string;
  description: string;
  price?: string | null;
  icon?: string | null;
  images: string[];
  features: string[];
}

interface ServiceDetailModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  showBookButton?: boolean;
}

export default function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  showBookButton = true,
}: ServiceDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const Icon =
    service.icon && iconMap[service.icon] ? iconMap[service.icon] : Sparkles;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset image index when service changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [service]);

  if (!isOpen) return null;

  const images = service.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      const diffX = startX - touch.clientX;

      if (Math.abs(diffX) > 50) {
        // Swipe threshold
        if (diffX > 0) {
          nextImage();
        } else {
          prevImage();
        }
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-3 lg:p-4 bg-slate-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl bg-slate-900 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] sm:max-h-[95vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {service.title}
              </h2>
              <p className="text-base sm:text-lg text-cyan-400 font-semibold truncate">
                {service.price || "Contact for Quote"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
          </button>
        </div>

        {/* Image Gallery */}
        {hasImages && (
          <div
            className="relative aspect-[4/3] sm:aspect-video bg-slate-800"
            onTouchStart={handleTouchStart}
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${service.title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-slate-900/90 hover:bg-slate-800 rounded-full transition-colors shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-slate-900/90 hover:bg-slate-800 rounded-full transition-colors shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-slate-900/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                  <span className="text-xs sm:text-sm text-white font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-cyan-400 w-4 sm:w-6 h-2 sm:h-2"
                          : "bg-white/50 hover:bg-white/70 w-2 h-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* No Images Placeholder */}
        {!hasImages && (
          <div className="relative aspect-[4/3] sm:aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-slate-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-500 text-sm sm:text-base">
                No images available
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
              About This Service
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                What's Included
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {service.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-slate-300 text-sm sm:text-base"
                  >
                    <span className="text-cyan-400 mt-0.5 sm:mt-1 shrink-0 text-xs sm:text-sm">
                      ✓
                    </span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Features Message */}
          {(!service.features || service.features.length === 0) && (
            <div className="text-center py-4 sm:py-6 bg-slate-800/20 rounded-lg sm:rounded-xl">
              <p className="text-slate-500 text-sm sm:text-base">
                No features listed for this service
              </p>
            </div>
          )}

          {/* CTA */}
          {showBookButton && (
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors text-sm sm:text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                onClick={onClose}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Book This Service
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
