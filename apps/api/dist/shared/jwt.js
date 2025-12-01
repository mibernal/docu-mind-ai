import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'documind-ai-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const generateToken = (payload) => {
    // Solución: convertir expiresIn al tipo correcto
    const expiresIn = JWT_EXPIRES_IN;
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
