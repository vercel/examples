import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnProjects = nextUrl.pathname.startsWith('/projects')
      const isAuthPage = nextUrl.pathname.startsWith('/login') ||
                         nextUrl.pathname.startsWith('/register')

      // Protected routes
      if (isOnDashboard || isOnProjects) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      // Redirect logged-in users away from auth pages
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
  providers: [], // Providers are configured in lib/auth.ts
} satisfies NextAuthConfig
