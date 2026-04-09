import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '1',
        email,
        password: hashedPassword,
        role: 'FARMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.register(email, password, 'FARMER');

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(
        new Error('Unique constraint failed on the fields: (`email`)')
      );

      await expect(
        service.register('test@example.com', 'password123', 'FARMER')
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '1',
        email,
        password: hashedPassword,
        role: 'FARMER',
      } as any);

      jest.spyOn(jwtService, 'sign').mockReturnValue('token123');

      const result = await service.login(email, password);

      expect(result).toBeDefined();
      expect(result.token).toBe('token123');
    });

    it('should throw error on invalid credentials', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateToken', () => {
    it('should validate JWT token successfully', async () => {
      const token = 'valid_token';
      const decoded = { sub: '1', email: 'test@example.com' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);

      const result = service.validateToken(token);

      expect(result).toEqual(decoded);
    });

    it('should throw error on invalid token', () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.validateToken('invalid_token')).toThrow();
    });
  });
});
