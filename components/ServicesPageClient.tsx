"use client";

import { useState } from "react";
import {
  Home,
  Briefcase,
  Sparkles,
  Package,
  Sofa,
  Wind,
  Star,
} from "lucide-react";
import Link from "next/link";
import ServiceDetailModal from "./ServiceDetailModal";

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

export default function ServicesPageClient({
  services,
}: {
  services: Service[];
}) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <>
      <div className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Services
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
              Professional cleaning solutions tailored to your needs. From
              regular house cleaning to specialized services, we've got you
              covered.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => {
              const Icon =
                service.icon && iconMap[service.icon]
                  ? iconMap[service.icon]
                  : Sparkles;

              return (
                <div
                  key={service.id}
                  className="card group flex flex-col h-full cursor-pointer hover:scale-[1.02] transition-transform duration-300 bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="relative h-40 sm:h-48 -mx-3 sm:-mx-4 lg:-mx-6 -mt-3 sm:-mt-4 lg:-mt-6 mb-4 sm:mb-6 overflow-hidden rounded-t-lg sm:rounded-t-xl shrink-0">
                    {service.images && service.images.length > 0 ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${service.images[0]})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 flex-grow line-clamp-3">
                      {service.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pt-3 sm:pt-4 lg:pt-6 border-t border-border mt-auto">
                      <span className="text-lg sm:text-xl font-bold text-primary text-center sm:text-left">
                        {service.price || "Contact for Quote"}
                      </span>
                      <button className="btn btn-primary py-2 px-4 text-sm sm:text-base w-full sm:w-auto">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {services.length === 0 && (
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
                No services available at the moment.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
            <div className="card max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Need a Custom Cleaning Package?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                We can create a personalized cleaning plan that fits your
                specific needs and budget.
              </p>
              <Link
                href="/contact"
                className="btn btn-primary inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              >
                Contact Us for a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
