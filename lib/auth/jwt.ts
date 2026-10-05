import { SignJWT, jwtVerify } from 'jose'

const ISSUER = 'konexa'
const EXPIRES = '12h'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // Dev-only fallback; production must set JWT_SECRET.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production')
    }
    return new TextEncoder().encode('konexa-dev-only-secret-change-me')
  }
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(EXPIRES)
    .sign(secretKey())
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER })
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') return null
    return { userId: payload.sub, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}
