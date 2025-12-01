import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'documind-ai-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  organizationId: string;
}

export const generateToken = (payload: TokenPayload): string => {
  // Solución: convertir expiresIn al tipo correcto
  const expiresIn = JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};