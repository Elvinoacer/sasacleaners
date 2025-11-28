import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function verifyLogin() {
  const email = 'admin@sasacleaners.com'
  const password = 'admin123'

  console.log(`Attempting login for ${email}...`)

  const user = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!user) {
    console.error('User not found!')
    return
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (isValid) {
    console.log('Login successful! Password matches.')
  } else {
    console.error('Login failed! Password does not match.')
  }
}

verifyLogin()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
