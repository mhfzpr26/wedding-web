import bcrypt from 'bcryptjs';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    'wedflow-secure-enterprise-jwt-key-2026-wedding-platform',
);

const TOKEN_EXPIRY = '7d';

export interface AdminSessionPayload extends JWTPayload {
  id: string;
  role: string;
  email?: string;
  name?: string;
}

/**
 * Hash a plain password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password against bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Sign an admin JWT token using jose.
 */
export async function signAdminToken(payload: {
  id: string;
  role: string;
  email?: string;
  name?: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify an admin JWT token using jose.
 */
export async function verifyAdminToken(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}
