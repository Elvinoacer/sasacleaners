import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all portfolio items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const items = await prisma.portfolioItem.findMany({
      where: category && category !== "All" ? { category } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    );
  }
}

// POST: Create a new portfolio item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, images } = body;

    // Validate required fields
    if (!category || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Category and at least one image are required" },
        { status: 400 }
      );
    }

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        description,
        category,
        images,
        likes: 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
