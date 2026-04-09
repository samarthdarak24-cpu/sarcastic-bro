import { Test, TestingModule } from '@nestjs/testing';
import { AiQualityShieldService } from '../ai-quality-shield.service';

describe('AiQualityShieldService', () => {
  let service: AiQualityShieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiQualityShieldService],
    }).compile();

    service = module.get<AiQualityShieldService>(AiQualityShieldService);
  });

  describe('analyzeQuality', () => {
    it('should analyze image quality and return grade', async () => {
      const result = await service.analyzeQuality('/path/to/image.jpg', 'prod-1');

      expect(result).toBeDefined();
      expect(result.grade).toMatch(/A\+|A|B\+|B/);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.defects)).toBe(true);
    });

    it('should return fallback grade on service error', async () => {
      const result = await service.analyzeQuality('/invalid/path.jpg', 'prod-1');

      expect(result.grade).toBe('B');
      expect(result.confidence).toBe(60);
    });
  });

  describe('detectDefects', () => {
    it('should detect defects in image', async () => {
      const defects = await service.detectDefects('/path/to/image.jpg');

      expect(Array.isArray(defects)).toBe(true);
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should calculate confidence score', async () => {
      const result = {
        defects: ['spot', 'discoloration'],
      };

      const confidence = await service.calculateConfidenceScore(result);

      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('gradeQuality', () => {
    it('should grade A+ for high confidence and no defects', async () => {
      const result = {
        confidence: 95,
        defects: [],
      };

      const grade = await service.gradeQuality(result);

      expect(grade).toBe('A+');
    });

    it('should grade A for good confidence and minimal defects', async () => {
      const result = {
        confidence: 85,
        defects: ['minor_spot'],
      };

      const grade = await service.gradeQuality(result);

      expect(grade).toBe('A');
    });

    it('should grade B+ for acceptable quality', async () => {
      const result = {
        confidence: 70,
        defects: ['spot', 'discoloration'],
      };

      const grade = await service.gradeQuality(result);

      expect(grade).toBe('B+');
    });

    it('should grade B for lower quality', async () => {
      const result = {
        confidence: 50,
        defects: ['spot', 'discoloration', 'damage'],
      };

      const grade = await service.gradeQuality(result);

      expect(grade).toBe('B');
    });
  });
});
