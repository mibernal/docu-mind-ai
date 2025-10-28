import { Response } from 'express';
import { prisma } from '../lib/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            plan: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        ...user,
        plan: user.subscriptions[0]?.plan || 'FREE',
        subscription: user.subscriptions[0] || null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email } = req.body;

    // Validar que el email no esté en uso por otro usuario
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: req.user?.userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            plan: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    res.json({
      user: {
        ...updatedUser,
        plan: updatedUser.subscriptions[0]?.plan || 'FREE',
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Organization name must be at least 2 characters' });
    }

    // Obtener el usuario para conocer su organización
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { organizationId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: user.organizationId },
      data: { name: name.trim() },
    });

    res.json({
      organization: updatedOrganization,
      message: 'Organization updated successfully',
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsageStats = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { organizationId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Obtener estadísticas de documentos
    const documentStats = await prisma.document.groupBy({
      by: ['status'],
      where: {
        organizationId: user.organizationId,
        uploadedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Este mes
        },
      },
      _count: {
        id: true,
      },
    });

    // Obtener documentos procesados exitosamente
    const processedDocuments = await prisma.documentProcessing.count({
      where: {
        document: {
          organizationId: user.organizationId,
          status: 'COMPLETED',
        },
      },
    });

    // Calcular tiempo ahorrado (estimado: 5 minutos por documento procesado)
    const timeSavedMinutes = processedDocuments * 5;
    const timeSavedHours = Math.round((timeSavedMinutes / 60) * 100) / 100;

    const stats = {
      totalDocuments: documentStats.reduce((acc, curr) => acc + curr._count.id, 0),
      processedDocuments,
      failedDocuments: documentStats.find(stat => stat.status === 'FAILED')?._count.id || 0,
      timeSaved: timeSavedHours,
      successRate: processedDocuments > 0 ? 
        Math.round((processedDocuments / (processedDocuments + (documentStats.find(stat => stat.status === 'FAILED')?._count.id || 0)) * 100)) : 0,
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    // En una implementación real, podrías querer marcar el usuario como inactivo
    // en lugar de eliminarlo completamente por temas de facturación y auditoría
    await prisma.user.delete({
      where: { id: req.user?.userId },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};