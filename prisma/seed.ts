import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

async function main() {
  const email = "djuma@gmail.com";
  const password = "Freedom2026!";
  const name = "SaSa Cleaners";

  const hashedPassword = await bcrypt.hash(password, 10);
  const deletedUsers = await prisma.adminUser.deleteMany();
  console.log(`Deleted ${deletedUsers} admin users from the database.`);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log({ user });

  // Seed testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      occupation: "Homeowner",
      rating: 5,
      comment:
        "SaSa Cleaners transformed my home! Their attention to detail is incredible. Every corner sparkles and they are always on time. I've been using their services for over a year and couldn't be happier.",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      approved: true,
      featured: true,
    },
    {
      name: "Michael Chen",
      occupation: "Office Manager",
      rating: 5,
      comment:
        "We've been using SaSa Cleaners for our office for over a year. Professional, reliable, and thorough. Our employees always comment on how great the office looks. Highly recommended!",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      approved: true,
      featured: true,
    },
    {
      name: "Emily Rodriguez",
      occupation: "Property Manager",
      rating: 5,
      comment:
        "The best cleaning service I've worked with. They handle multiple properties for us and always exceed expectations. Communication is excellent and the quality is consistently top-notch.",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      approved: true,
      featured: true,
    },
    {
      name: "David Kim",
      occupation: "Restaurant Owner",
      rating: 5,
      comment:
        "SaSa Cleaners has been cleaning our restaurant for 6 months now. They understand the high standards required in the food industry and deliver every single time. Worth every penny!",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      approved: true,
      featured: true,
    },
    {
      name: "Lisa Anderson",
      occupation: "Homeowner",
      rating: 5,
      comment:
        "I was skeptical at first, but SaSa Cleaners proved me wrong. They cleaned my home after a renovation and it was spotless. They even cleaned areas I didn't think to mention. Amazing service!",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
      approved: true,
      featured: true,
    },
    {
      name: "James Wilson",
      occupation: "Airbnb Host",
      rating: 5,
      comment:
        "As an Airbnb host, cleanliness is crucial. SaSa Cleaners has been a game-changer for my business. Quick turnarounds, exceptional quality, and my guests always leave 5-star reviews about cleanliness.",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      approved: true,
      featured: true,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.name.replace(/\s+/g, "-").toLowerCase() },
      update: testimonial,
      create: {
        id: testimonial.name.replace(/\s+/g, "-").toLowerCase(),
        ...testimonial,
      },
    });
  }

  console.log(`Seeded ${testimonials.length} testimonials`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
