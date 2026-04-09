import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class VideoCallingService {
  private prisma: PrismaClient;
  private activeCalls: Map<string, any> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
  }

  async initiateVideoCall(data: {
    initiatorId: string;
    recipientId: string;
    type: 'PRODUCT_DEMO' | 'NEGOTIATION' | 'SUPPORT';
  }) {
    const callId = `call_${Date.now()}`;
    const iceServers = this.getIceServers();

    const callSession = {
      callId,
      initiatorId: data.initiatorId,
      recipientId: data.recipientId,
      type: data.type,
      status: 'RINGING',
      startTime: new Date(),
      iceServers,
      signalingServer: process.env.SIGNALING_SERVER || 'ws://localhost:3001',
    };

    this.activeCalls.set(callId, callSession);

    await this.prisma.videoCall.create({
      data: {
        callId,
        initiatorId: data.initiatorId,
        recipientId: data.recipientId,
        type: data.type,
        status: 'INITIATED',
      },
    });

    return callSession;
  }

  async acceptCall(callId: string, userId: string) {
    const call = this.activeCalls.get(callId);
    if (!call) throw new Error('Call not found');

    call.status = 'ACTIVE';
    call.acceptedAt = new Date();

    await this.prisma.videoCall.update({
      where: { callId },
      data: { status: 'ACTIVE', acceptedAt: new Date() },
    });

    return call;
  }

  async endCall(callId: string) {
    const call = this.activeCalls.get(callId);
    if (!call) throw new Error('Call not found');

    const duration = Math.floor(
      (new Date().getTime() - call.startTime.getTime()) / 1000
    );

    await this.prisma.videoCall.update({
      where: { callId },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
        duration,
      },
    });

    this.activeCalls.delete(callId);

    return { callId, duration, quality: this.calculateCallQuality() };
  }

  async getCallHistory(userId: string, limit: number = 20) {
    const calls = await this.prisma.videoCall.findMany({
      where: {
        OR: [{ initiatorId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return calls.map((call) => ({
      callId: call.callId,
      otherParty:
        call.initiatorId === userId ? call.recipientId : call.initiatorId,
      type: call.type,
      duration: call.duration || 0,
      timestamp: call.createdAt,
      quality: call.quality || 'GOOD',
    }));
  }

  async recordCall(callId: string, recordingUrl: string) {
    await this.prisma.videoCall.update({
      where: { callId },
      data: {
        recordingUrl,
        isRecorded: true,
      },
    });

    return { callId, recordingUrl, status: 'RECORDED' };
  }

  async enableScreenShare(callId: string, userId: string) {
    const call = this.activeCalls.get(callId);
    if (!call) throw new Error('Call not found');

    call.screenShareActive = true;
    call.screenShareUserId = userId;

    return {
      callId,
      screenShareActive: true,
      userId,
    };
  }

  private getIceServers() {
    return [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:turn.example.com:3478',
        username: 'user',
        credential: 'pass',
      },
    ];
  }

  private calculateCallQuality(): string {
    const quality = Math.random();
    if (quality > 0.8) return 'EXCELLENT';
    if (quality > 0.6) return 'GOOD';
    if (quality > 0.4) return 'FAIR';
    return 'POOR';
  }
}
