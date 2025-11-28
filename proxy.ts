import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  },
})

export const config = { 
  matcher: [
    '/admin/((?!login).*)'  // Protect all /admin routes EXCEPT /admin/login
  ]
}
