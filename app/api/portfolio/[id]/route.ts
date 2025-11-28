import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from '@/lib/storage';

// PUT: Update a portfolio item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, category, images } = body;

    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title,
        description,
        category,
        images,
      },
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a portfolio item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the item to get its image URLs before deleting
    const item = await prisma.portfolioItem.findUnique({
      where: { id },
      select: { images: true } // Only select images to minimize data transfer
    });

    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    // Delete images from storage
    if (item.images && item.images.length > 0) {
      await Promise.all(item.images.map(url => deleteFile(url)));
    }

    await prisma.portfolioItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Item deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
