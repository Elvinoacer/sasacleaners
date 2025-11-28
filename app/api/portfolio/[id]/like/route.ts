import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Like a portfolio item
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment the likes count
    const portfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return NextResponse.json(portfolioItem, { status: 200 });
  } catch (error) {
    console.error("Error liking portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to like portfolio item" },
      { status: 500 }
    );
  }
}

// DELETE: Unlike a portfolio item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Decrement the likes count (but don't go below 0)
    const currentItem = await prisma.portfolioItem.findUnique({
      where: { id },
      select: { likes: true }
    });

    if (!currentItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    const portfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        likes: Math.max(0, currentItem.likes - 1)
      }
    });

    return NextResponse.json(portfolioItem, { status: 200 });
  } catch (error) {
    console.error("Error unliking portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to unlike portfolio item" },
      { status: 500 }
    );
  }
}
