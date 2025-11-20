// lib/jwt.ts
export interface JwtPayload {
  sub: string;           // userId en formato "sub"
  email: string;
  role: 'student' | 'teacher' | 'admin' | null;
  iat?: number;
  exp?: number;
  isEmailVerified: boolean;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    
    // Verificar expiración
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('Token expirado');
      return null;
    }
    
    return payload as JwtPayload;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}
