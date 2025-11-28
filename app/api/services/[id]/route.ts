import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { deleteFile } from '@/lib/storage';

// PUT: Update a service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, price, icon, images, features } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        price,
        icon,
        images,
        features,
      },
    });

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Retrieve the service to get its images before deleting
    const service = await prisma.service.findUnique({
      where: { id },
      select: { images: true }
    });

    // Delete images from storage if they exist
    if (service && service.images && service.images.length > 0) {
      await Promise.all(service.images.map(url => deleteFile(url)))
    }

    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Service deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Error deleting service' }, { status: 500 })
  }
}
