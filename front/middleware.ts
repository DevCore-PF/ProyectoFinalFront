// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const token = request.cookies.get('auth-token')?.value;
  const user = token ? decodeToken(token) : null;
 
  
  // ============================================
  // RUTAS PÚBLICAS
  // ============================================
  const publicRoutes = [
    '/', '/courses', '/company', '/plans', '/contact-us',
    '/benefits', '/faq', '/achievements', '/our-goals'
  ];
  
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }
  
  // ============================================
  // /role - Solo si tiene token pero NO tiene rol
  // ============================================
  if (path === '/role') {
    if (!user) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    if (user.role !== null) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  // ============================================
  // RUTAS DE AUTENTICACIÓN (login, register)
  // ============================================
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(path);
  
  if (isAuthRoute) {
    // Si tiene token Y tiene rol → redirigir a home
    if (user && user.role !== null  && user.isEmailVerified) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Si tiene token pero sin rol → redirigir a /role
    if (user && user.role === null) {
      return NextResponse.redirect(new URL('/role', request.url));
    }
    // Sin token → permitir acceso
    return NextResponse.next();
  }
  
  // ============================================
  // RUTAS PROTEGIDAS - Solo verificar token y rol
  // ============================================
  const protectedRoutes = [
    '/teacher-dashboard',
    '/dashboard',
    '/cart',
    '/profile',
    '/payment-cancelled',
    '/payment-success',
    '/checkout'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    // Sin token → login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Con token pero sin rol → home (modal se encarga)
    if (user.role === null) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
  }
  
  // ============================================
  // PROTECCIÓN POR ROL - ADMIN
  // ============================================
  if (path.startsWith('/admin')) {
    if (!user || user.role === null) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // ============================================
  // PROTECCIÓN POR ROL - TEACHER
  // ============================================
  if (path.startsWith('/teacher-dashboard')) {
    if (!user || user.role === null) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'teacher') {
      if (user.role === 'student') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // ============================================
  // PROTECCIÓN POR ROL - STUDENT
  // ============================================
  if (path === '/dashboard' || (path.startsWith('/dashboard/') && !path.startsWith('/teacher-dashboard'))) {
    if (!user || user.role === null) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'student') {
      if (user.role === 'teacher') {
        return NextResponse.redirect(new URL('/teacher-dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons).*)',
  ]
};
