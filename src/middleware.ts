import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'yhyy_token'

const protectedPaths = ['/workspace', '/intake', '/card', '/dashboard', '/admin']
const adminPaths = ['/dashboard', '/admin']

function isPathProtected(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
}

function isPathAdmin(pathname: string): boolean {
  return adminPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Allow API routes and public paths to pass through
  if (pathname.startsWith('/api') || !isPathProtected(pathname)) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/auth/login', request.url)

  // Redirect to login if no token is present on a protected path
  if (!token || token.trim() === '') {
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For admin paths, check that the cookie exists (role verification is done in API routes)
  if (isPathAdmin(pathname)) {
    if (!token || token.trim() === '') {
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/workspace/:path*',
    '/intake/:path*',
    '/card/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}
