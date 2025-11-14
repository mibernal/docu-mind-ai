// server/src/controllers/auth.controller.ts - VERSIÓN CORREGIDA
import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';
import { jsonToString } from '../utils/json';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create default organization
    const organization = await prisma.organization.create({
      data: {
        name: `${name || email}'s Organization`,
      },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        organizationId: organization.id,
      },
    });

    // Create free subscription
    await prisma.billingSubscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
      },
    });

    // CREATE USER PREFERENCES WITH DEFAULT VALUES
    // @ts-ignore - Temporal hasta que Prisma se regenere
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        useCase: 'CONTRACT_CERTIFICATION',
        customFields: null,
      },
    });

    // CREATE DEFAULT EXTRACTION TEMPLATE FOR USER
    const defaultTemplate = {
      fields: [
        {
          name: "cliente",
          type: "text",
          required: true,
          description: "Client or contracting entity name"
        },
        {
          name: "contratista",
          type: "text", 
          required: true,
          description: "Contractor or provider name"
        },
        {
          name: "fechaInicio",
          type: "date",
          required: true,
          description: "Contract start date"
        },
        {
          name: "fechaFin",
          type: "date",
          required: true,
          description: "Contract end date"
        },
        {
          name: "objeto",
          type: "text",
          required: true,
          description: "Contract purpose"
        },
        {
          name: "valorSinIva",
          type: "currency",
          required: true,
          description: "Contract value without VAT"
        },
        {
          name: "valorConIva",
          type: "currency",
          required: true,
          description: "Contract value with VAT"
        }
      ]
    };

    // @ts-ignore - Temporal hasta que Prisma se regenere
    await prisma.extractionTemplate.create({
      data: {
        name: 'Basic Contract Certification',
        description: 'Default template for contract certifications',
        fields: jsonToString(defaultTemplate),
        organizationId: organization.id,
        userId: user.id,
        isDefault: true,
        category: 'contract'
      },
    });

    // Generate token
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

    // Find user with all necessary relations
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        // @ts-ignore - Temporal
        preferences: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
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
        preferences: user.preferences ? {
          useCase: user.preferences.useCase,
          customFields: user.preferences.customFields ? 
            JSON.parse(user.preferences.customFields) : null
        } : null
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
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        // @ts-ignore - Temporal
        preferences: true,
        // @ts-ignore - Temporal  
        customFields: true,
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
        preferences: user.preferences ? {
          useCase: user.preferences.useCase,
          customFields: user.preferences.customFields ? 
            JSON.parse(user.preferences.customFields) : null
        } : null,
        customFields: user.customFields
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};