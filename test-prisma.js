const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Prisma client initialized successfully');
prisma.$disconnect();
