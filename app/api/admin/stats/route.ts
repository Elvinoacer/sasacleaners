import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all statistics in parallel for better performance
    const [
      servicesCount,
      portfolioCount,
      pendingTestimonialsCount,
      unreadInquiriesCount,
      totalLikes,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.portfolioItem.count(),
      prisma.testimonial.count({ where: { approved: false } }),
      prisma.inquiry.count({ where: { read: false } }),
      prisma.portfolioItem.aggregate({
        _sum: {
          likes: true,
        },
      }),
    ]);

    const stats = {
      services: servicesCount,
      portfolioItems: portfolioCount,
      pendingTestimonials: pendingTestimonialsCount,
      unreadInquiries: unreadInquiriesCount,
      totalLikes: totalLikes._sum.likes || 0,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
