import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import type { RegisterInput, LoginInput, UpdateProfileInput, SubmitKYCInput } from "./auth.validation";

const SALT_ROUNDS = 12;

type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string | null;
  district: string | null;
  state: string | null;
  kycStatus: string;
  isActive: boolean;
  createdAt: Date;
};

export class AuthService {
  private static getRefreshTokenExpiry(token: string) {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    return new Date(decoded.exp * 1000);
  }

  private static sanitizeUser<T extends { password?: string }>(user: T) {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  private static async persistRefreshToken(userId: string, refreshToken: string) {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: this.getRefreshTokenExpiry(refreshToken),
      },
    });
  }

  static generateTokens(userId: string, role: string, email: string) {
    const accessToken = jwt.sign({ userId, role, email }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as any,
    });

    const refreshToken = jwt.sign(
      { userId, role, email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY as any },
    );

    return { accessToken, refreshToken };
  }

  static async register(data: RegisterInput) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.email === normalizedEmail) {
        throw ApiError.conflict("A user with this email already exists");
      }

      throw ApiError.conflict("A user with this phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        password: hashedPassword,
        role: data.role,
        phone: data.phone,
        district: data.district,
        state: data.state,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        district: true,
        state: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async login(data: LoginInput) {
    const identifier = (data.identifier ?? data.email ?? "").trim();
    const normalizedEmail = identifier.toLowerCase();

    const user = (await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: identifier }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        district: true,
        state: true,
        kycStatus: true,
        isActive: true,
        createdAt: true,
      },
    })) as UserRecord | null;

    if (!user) {
      throw ApiError.unauthorized("Invalid email/phone or password");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated");
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw ApiError.unauthorized("Invalid email/phone or password");
    }

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), tokens };
  }

  static async refreshToken(token: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    try {
      jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const tokens = this.generateTokens(
      storedToken.user.id,
      storedToken.user.role,
      storedToken.user.email,
    );

    await this.persistRefreshToken(storedToken.user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(storedToken.user), tokens };
  }

  static async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { userId, token: refreshToken },
      });
      return;
    }

    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        district: true,
        state: true,
        avatarUrl: true,
        kycStatus: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  static async updateProfile(userId: string, data: Partial<UpdateProfileInput>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.district && { district: data.district }),
        ...(data.state && { state: data.state }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        district: true,
        state: true,
        avatarUrl: true,
        kycStatus: true,
      },
    });
    return user;
  }

  static async uploadAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });
    return user;
  }

  static async submitKYC(userId: string, data: SubmitKYCInput, documentUrls: string[]) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const updateData: any = {
      kycStatus: "PENDING", // Set to PENDING for admin verification
      kycDocumentUrl: documentUrls.length > 0 ? JSON.stringify(documentUrls) : null,
    };

    if (data.role === "FARMER") {
      updateData.aadhaarNumber = data.aadharNumber;
      updateData.panNumber = data.panNumber;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    return updated;
  }

  static async getKYCStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        kycStatus: true,
        kycDocumentUrl: true,
        aadhaarNumber: true,
        panNumber: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return {
      userId: user.id,
      status: user.kycStatus,
      documents: user.kycDocumentUrl ? JSON.parse(user.kycDocumentUrl) : [],
      aadharVerified: !!user.aadhaarNumber,
      panVerified: !!user.panNumber,
    };
  }

  static async getKYCInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        kycStatus: true,
        district: true,
        state: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }
}
