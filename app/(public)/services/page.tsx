import { prisma } from '@/lib/prisma'
import ServicesPageClient from '@/components/ServicesPageClient'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' }
  })

  return <ServicesPageClient services={services} />
}
