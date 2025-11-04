import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Crear organización por defecto
    const organization = await prisma.organization.create({
      data: {
        name: `${name || email}'s Organization`,
      },
    });

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        organizationId: organization.id,
      },
    });

    // Crear suscripción gratuita
    await prisma.billingSubscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
      },
    });

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      organizationId: organization.id,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        subscriptions: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verificar password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organization.id,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
        },
        plan: user.subscriptions[0]?.plan || 'FREE',
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: {
        organization: true,
        subscriptions: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
        },
        plan: user.subscriptions[0]?.plan || 'FREE',
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Con JWT, el logout es principalmente del lado del cliente
  // Podríamos implementar una blacklist de tokens si es necesario
  res.json({ message: 'Logged out successfully' });
};