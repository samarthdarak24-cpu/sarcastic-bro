import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SecurityService {
  async getSecurityStatus(userId: string) {
    const [recentEvents, suspiciousCount, totalSessions] = await Promise.all([
      prisma.securityEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.securityEvent.count({
        where: {
          userId,
          riskLevel: { in: ['HIGH', 'CRITICAL'] },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.securityEvent.count({
        where: {
          userId,
          eventType: 'LOGIN',
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    const riskLevel = suspiciousCount > 5 ? 'HIGH' : suspiciousCount > 2 ? 'MEDIUM' : 'LOW';

    return {
      riskLevel,
      suspiciousActivities: suspiciousCount,
      totalSessions,
      recentEvents,
      lastLogin: recentEvents.find(e => e.eventType === 'LOGIN')?.createdAt
    };
  }

  async getSecurityEvents(userId: string, filters: { eventType?: string; riskLevel?: string; page?: number; limit?: number }) {
    const { eventType, riskLevel, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (eventType) where.eventType = eventType;
    if (riskLevel) where.riskLevel = riskLevel;

    const [events, total] = await Promise.all([
      prisma.securityEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.securityEvent.count({ where })
    ]);

    return {
      events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getSessions(userId: string) {
    const sessions = await prisma.securityEvent.findMany({
      where: {
        userId,
        eventType: 'LOGIN',
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return {
      sessions: sessions.map(s => ({
        id: s.id,
        ipAddress: s.ipAddress,
        location: s.location,
        userAgent: s.userAgent,
        loginTime: s.createdAt,
        active: true // Simplified
      }))
    };
  }

  async logSecurityEvent(data: {
    userId: string;
    eventType: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    riskLevel?: string;
    metadata?: any;
  }) {
    return prisma.securityEvent.create({
      data: {
        ...data,
        riskLevel: data.riskLevel || 'LOW',
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });
  }

  async terminateSession(sessionId: string, userId: string) {
    const session = await prisma.securityEvent.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.userId !== userId) {
      throw new Error('Session not found or unauthorized');
    }

    await prisma.securityEvent.create({
      data: {
        userId,
        eventType: 'LOGOUT',
        ipAddress: session.ipAddress,
        location: session.location,
        riskLevel: 'LOW',
        metadata: JSON.stringify({ terminatedSessionId: sessionId })
      }
    });

    return { success: true };
  }
}
