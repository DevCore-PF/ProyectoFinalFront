// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/jwt';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔒 MIDDLEWARE - Ruta:', path);
  
  const token = request.cookies.get('auth-token')?.value;
  const user = token ? decodeToken(token) : null;
  
  console.log('👤 Usuario:', user?.email || 'sin usuario');
  console.log('🎭 Rol:', user?.role || 'sin rol');
  
  // ============================================
  // RUTAS PÚBLICAS
  // ============================================
  const publicRoutes = [
    '/', '/courses', '/company', '/plans', '/contact-us',
    '/benefits', '/faq', '/achievements', '/our-goals'
  ];
  
  if (publicRoutes.includes(path)) {
    console.log('✅ Ruta pública - permitida\n');
    return NextResponse.next();
  }
  
  // ============================================
  // /role - Solo si tiene token pero NO tiene rol
  // ============================================
  if (path === '/role') {
    if (!user) {
      console.log('❌ /role sin token → redirect /register\n');
      return NextResponse.redirect(new URL('/register', request.url));
    }
    if (user.role !== null) {
      console.log('❌ /role con rol → redirect /\n');
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log('✅ /role - acceso permitido\n');
    return NextResponse.next();
  }
  
  // ============================================
  // RUTAS DE AUTENTICACIÓN (login, register)
  // ============================================
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(path);
  
  if (isAuthRoute) {
    // Si tiene token Y tiene rol → redirigir a home
    if (user && user.role !== null) {
      console.log('❌ Usuario con rol en', path, '→ redirect /\n');
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Si tiene token pero sin rol → redirigir a /role
    if (user && user.role === null) {
      console.log('❌ Usuario sin rol en', path, '→ redirect /role\n');
      return NextResponse.redirect(new URL('/role', request.url));
    }
    // Sin token → permitir acceso
    console.log('✅ Sin token - permitir', path, '\n');
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
    console.log('🔐 Ruta protegida detectada');
    
    // Sin token → login
    if (!user) {
      console.log('❌ Sin token → redirect /login\n');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Con token pero sin rol → home (modal se encarga)
    if (user.role === null) {
      console.log('❌ Sin rol → redirect / (modal)\n');
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('✅ Token y rol válidos - continuar\n');
    // Continuamos con las verificaciones por rol específico
  }
  
  // ============================================
  // PROTECCIÓN POR ROL - ADMIN
  // ============================================
  if (path.startsWith('/admin')) {
    if (!user || user.role === null) {
      console.log('❌ No autenticado en admin\n');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'admin') {
      console.log('❌ No es admin\n');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // ============================================
  // PROTECCIÓN POR ROL - TEACHER
  // ============================================
  if (path.startsWith('/teacher-dashboard')) {
    if (!user || user.role === null) {
      console.log('❌ No autenticado en teacher-dashboard\n');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'teacher') {
      console.log('❌ No es teacher\n');
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
      console.log('❌ No autenticado en dashboard\n');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'student') {
      console.log('❌ No es student\n');
      if (user.role === 'teacher') {
        return NextResponse.redirect(new URL('/teacher-dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  console.log('✅ Acceso permitido\n');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons).*)',
  ]
};
