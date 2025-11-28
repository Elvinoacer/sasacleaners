"use client";

import { useState, useEffect } from "react";
import { Star, Quote, Loader2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string | null;
  occupation: string | null;
  rating: number;
  comment: string;
  imageUrl: string | null;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        console.log("Raw testimonials data:", data);

        // CRITICAL: Only show featured testimonials with images
        const featured = data.filter((t: Testimonial) => {
          const isFeatured = t.featured === true;
          const isApproved = t.approved === true;
          const hasImage = t.imageUrl && t.imageUrl.trim() !== "";

          // Log filtering for debugging
          if (!isFeatured || !isApproved || !hasImage) {
            console.log(`Filtered out testimonial ${t.id}:`, {
              featured: isFeatured,
              approved: isApproved,
              hasImage: hasImage,
              imageUrl: t.imageUrl,
            });
          }

          return isFeatured && isApproved && hasImage;
        });

        console.log("Featured testimonials count:", featured.length);
        setTestimonials(featured);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", occupation: "", rating: 5, comment: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Client{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Testimonials
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about SaSa Cleaners.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto">
          <div className="card text-center p-4 sm:p-6 bg-card border border-border rounded-xl sm:rounded-2xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              500+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Happy Clients
            </div>
          </div>
          <div className="card text-center p-4 sm:p-6 bg-card border border-border rounded-xl sm:rounded-2xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              4.9/5
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Average Rating
            </div>
          </div>
          <div className="card text-center p-4 sm:p-6 bg-card border border-border rounded-xl sm:rounded-2xl">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
              98%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Return Rate
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20 mb-12 sm:mb-16 lg:mb-20">
            <p className="text-muted-foreground text-base sm:text-lg">
              No testimonials yet. Be the first to share your experience!
            </p>
          </div>
        )}

        {!isLoading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="card relative bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Quote className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary/20" />

                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary flex-shrink-0"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 italic leading-relaxed line-clamp-4 sm:line-clamp-5">
                  "{testimonial.comment}"
                </p>

                <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${testimonial.imageUrl})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">
                      {testimonial.name || "Anonymous"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">
                      {testimonial.occupation || "Customer"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submission Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Share Your Experience
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                We'd love to hear about your experience with SaSa Cleaners. Your
                feedback helps us improve and helps others make informed
                decisions.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5 lg:space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Anonymous"
                />
              </div>

              <div>
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium mb-2"
                >
                  Occupation (Optional)
                </label>
                <input
                  type="text"
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      occupation: e.target.value,
                    }))
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g., Homeowner, Office Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3">
                  Rating *
                </label>
                <div className="flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating }))
                      }
                      className="p-1.5 sm:p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${
                          rating <= formData.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    ({formData.rating} star{formData.rating !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium mb-2"
                >
                  Your Review *
                </label>
                <textarea
                  id="comment"
                  required
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                  placeholder="Share your experience with SaSa Cleaners..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>

              {submitStatus === "success" && (
                <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm sm:text-base text-center">
                  Thank you for your feedback! Your review will be published
                  after approval.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm sm:text-base text-center">
                  Something went wrong. Please try again later.
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                All reviews are subject to approval before being published.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
