import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Global Background Elements (Subtle ambience for all pages) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Optional: Subtle background pattern/texture for better visual depth */}
      <div className="fixed inset-0 z-[-1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      {/* Navbar: Usually fixed or sticky. Z-index ensures it stays on top */}
      <Navbar />

      {/* Main Content Area:
        1. flex-grow: Pushes footer down.
        2. Responsive padding-top: 
           - Mobile: pt-16 (4rem/64px) - Compact header space
           - Tablet: pt-20 (5rem/80px) - Slightly more space
           - Desktop: pt-24 (6rem/96px) - Standard space for floating navbar
        3. container: Keeps content centered with responsive padding
        4. max-w-full: Ensures content can use full width when needed
      */}
      <main className="flex-grow w-full max-w-full pt-16 sm:pt-20 md:pt-24 relative z-10">
        {children}
      </main>

      {/* Footer: Automatically stays at bottom due to flex-grow above */}
      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
