import AWS from 'aws-sdk';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('StorageService');

class StorageService {
  private s3: AWS.S3;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || 'marketplace';
    this.publicUrl = process.env.S3_PUBLIC_URL || 'http://localhost:9000/marketplace';

    // Configure S3 client
    this.s3 = new AWS.S3({
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minioadmin',
      region: process.env.S3_REGION || 'us-east-1',
      s3ForcePathStyle: process.env.S3_USE_PATH_STYLE_URL === 'true',
      signatureVersion: 'v4',
    });
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'uploads'
  ): Promise<string> {
    try {
      const key = `${folder}/${Date.now()}-${fileName}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
      };

      await this.s3.putObject(params).promise();
      logger.info(`File uploaded: ${key}`);

      return `${this.publicUrl}/${key}`;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: Array<{ buffer: Buffer; originalName: string; mimetype: string }>,
    folder: string = 'uploads'
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadFile(file.buffer, file.originalName, file.mimetype, folder)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      logger.error('Error uploading multiple files:', error);
      throw new Error('Failed to upload files');
    }
  }

  /**
   * Upload product images
   */
  async uploadProductImages(
    files: Array<{ buffer: Buffer; originalName: string; mimetype: string }>
  ): Promise<string[]> {
    return this.uploadFiles(files, 'products');
  }

  /**
   * Upload quality scan image
   */
  async uploadQualityScanImage(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    return this.uploadFile(fileBuffer, fileName, mimeType, 'quality-scans');
  }

  /**
   * Upload invoice
   */
  async uploadInvoice(
    fileBuffer: Buffer,
    fileName: string
  ): Promise<string> {
    return this.uploadFile(fileBuffer, fileName, 'application/pdf', 'invoices');
  }

  /**
   * Upload chat attachment
   */
  async uploadChatAttachment(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    return this.uploadFile(fileBuffer, fileName, mimeType, 'chat-attachments');
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        logger.warn(`Could not extract key from URL: ${fileUrl}`);
        return;
      }

      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
      logger.info(`File deleted: ${key}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(fileUrls: string[]): Promise<void> {
    try {
      const keys = fileUrls
        .map((url) => this.extractKeyFromUrl(url))
        .filter((key) => key !== null) as string[];

      if (keys.length === 0) return;

      const params: AWS.S3.DeleteObjectsRequest = {
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      };

      await this.s3.deleteObjects(params).promise();
      logger.info(`${keys.length} files deleted`);
    } catch (error) {
      logger.error('Error deleting multiple files:', error);
      throw new Error('Failed to delete files');
    }
  }

  /**
   * Get file from S3
   */
  async getFile(fileUrl: string): Promise<Buffer> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new Error('Invalid file URL');
      }

      const params: AWS.S3.GetObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      const data = await this.s3.getObject(params).promise();
      return data.Body as Buffer;
    } catch (error) {
      logger.error('Error getting file:', error);
      throw new Error('Failed to get file');
    }
  }

  /**
   * Generate presigned URL for temporary access
   */
  async generatePresignedUrl(fileUrl: string, expirationSeconds: number = 3600): Promise<string> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new Error('Invalid file URL');
      }

      const params: AWS.S3.GetObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      return this.s3.getSignedUrl('getObject', {
        ...params,
        Expires: expirationSeconds,
      });
    } catch (error) {
      logger.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) return false;

      const params: AWS.S3.HeadObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract S3 key from URL
   */
  private extractKeyFromUrl(fileUrl: string): string | null {
    try {
      // Handle different URL formats
      if (fileUrl.includes(this.publicUrl)) {
        return fileUrl.replace(this.publicUrl + '/', '');
      }

      // Try to extract from S3 endpoint URL
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch (error) {
      logger.error('Error extracting key from URL:', error);
      return null;
    }
  }

  /**
   * Get bucket info
   */
  async getBucketInfo(): Promise<{ name: string; region: string }> {
    return {
      name: this.bucketName,
      region: process.env.S3_REGION || 'us-east-1',
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      logger.info('S3 storage health check passed');
      return true;
    } catch (error) {
      logger.error('S3 storage health check failed:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
