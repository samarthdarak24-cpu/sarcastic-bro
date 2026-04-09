import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

interface QualityAnalysisResult {
  grade: 'A+' | 'A' | 'B+' | 'B';
  confidence: number;
  defects: string[];
  certificate: string;
  timestamp: Date;
}

@Injectable()
export class AiQualityShieldService {
  private readonly logger = new Logger(AiQualityShieldService.name);
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async analyzeQuality(imagePath: string, productId: string): Promise<QualityAnalysisResult> {
    try {
      this.logger.log(`Analyzing quality for product: ${productId}`);

      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      formData.append('product_id', productId);

      const response = await axios.post(
        `${this.aiServiceUrl}/api/quality-analysis`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000,
        }
      );

      const result = response.data;

      // Validate result
      this.validateQualityResult(result);

      // Generate certificate
      const certificate = await this.generateCertificate(productId, result);

      return {
        grade: result.grade,
        confidence: result.confidence,
        defects: result.defects || [],
        certificate,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Quality analysis failed: ${error.message}`);
      return this.getFallbackGrade();
    }
  }

  private validateQualityResult(result: any): void {
    const validGrades = ['A+', 'A', 'B+', 'B'];
    
    if (!validGrades.includes(result.grade)) {
      throw new Error(`Invalid grade: ${result.grade}`);
    }

    if (result.confidence < 0 || result.confidence > 100) {
      throw new Error(`Invalid confidence: ${result.confidence}`);
    }

    if (!Array.isArray(result.defects)) {
      throw new Error('Defects must be an array');
    }
  }

  private async generateCertificate(productId: string, result: any): Promise<string> {
    try {
      const certificateData = {
        productId,
        grade: result.grade,
        confidence: result.confidence,
        defects: result.defects,
        timestamp: new Date().toISOString(),
        certificateNumber: `CERT-${Date.now()}-${productId}`,
      };

      // Generate PDF certificate
      const certificateUrl = await this.generatePdfCertificate(certificateData);
      return certificateUrl;
    } catch (error) {
      this.logger.error(`Certificate generation failed: ${error.message}`);
      return '';
    }
  }

  private async generatePdfCertificate(data: any): Promise<string> {
    // Placeholder for PDF generation
    // In production, use a library like pdfkit or puppeteer
    return `https://certificates.example.com/${data.certificateNumber}.pdf`;
  }

  private getFallbackGrade(): QualityAnalysisResult {
    this.logger.warn('Using fallback grade due to service unavailability');
    return {
      grade: 'B',
      confidence: 60,
      defects: [],
      certificate: '',
      timestamp: new Date(),
    };
  }

  async detectDefects(imagePath: string): Promise<string[]> {
    try {
      const response = await axios.post(
        `${this.aiServiceUrl}/api/defect-detection`,
        { image_path: imagePath },
        { timeout: 30000 }
      );

      return response.data.defects || [];
    } catch (error) {
      this.logger.error(`Defect detection failed: ${error.message}`);
      return [];
    }
  }

  async calculateConfidenceScore(analysisResult: any): Promise<number> {
    // Calculate confidence based on multiple factors
    let confidence = 100;

    // Reduce confidence for detected defects
    if (analysisResult.defects && analysisResult.defects.length > 0) {
      confidence -= analysisResult.defects.length * 5;
    }

    // Ensure confidence is within valid range
    return Math.max(0, Math.min(100, confidence));
  }

  async gradeQuality(analysisResult: any): Promise<'A+' | 'A' | 'B+' | 'B'> {
    const confidence = analysisResult.confidence;
    const defectCount = analysisResult.defects?.length || 0;

    if (confidence >= 95 && defectCount === 0) {
      return 'A+';
    } else if (confidence >= 85 && defectCount <= 1) {
      return 'A';
    } else if (confidence >= 70 && defectCount <= 3) {
      return 'B+';
    } else {
      return 'B';
    }
  }
}
