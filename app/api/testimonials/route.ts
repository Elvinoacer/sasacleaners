export const runtime = "nodejs";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, occupation, rating, comment } = body

    // Validate required fields
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Save to database (approved = false by default)
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name || 'Anonymous',
        occupation: occupation || null,
        rating: parseInt(rating),
        comment,
        approved: false, // Requires admin approval
      },
    })

    return NextResponse.json(
      { message: 'Testimonial submitted successfully', id: testimonial.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Testimonial submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Only return approved testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(testimonials, { status: 200 })
  } catch (error) {
    console.error('Testimonials fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
