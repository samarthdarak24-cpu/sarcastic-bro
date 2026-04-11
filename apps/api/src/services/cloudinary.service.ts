// ========================================================================
// Cloudinary Service - File Upload to Cloud Storage
// ========================================================================

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload file to Cloudinary
   * @param filePath - Local file path
   * @param folder - Cloudinary folder name
   * @returns Cloudinary URL
   */
  static async uploadFile(filePath: string, folder: string = 'agrivoice'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
      });

      // Delete local file after upload
      fs.unlinkSync(filePath);

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to cloud storage');
    }
  }

  /**
   * Upload multiple files to Cloudinary
   * @param filePaths - Array of local file paths
   * @param folder - Cloudinary folder name
   * @returns Array of Cloudinary URLs
   */
  static async uploadMultipleFiles(filePaths: string[], folder: string = 'agrivoice'): Promise<string[]> {
    try {
      const uploadPromises = filePaths.map(filePath => this.uploadFile(filePath, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error('Failed to upload files to cloud storage');
    }
  }

  /**
   * Delete file from Cloudinary
   * @param publicId - Cloudinary public ID
   */
  static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete file from cloud storage');
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Cloudinary URL
   * @returns Public ID
   */
  static extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  /**
   * Check if Cloudinary is configured
   * @returns boolean
   */
  static isConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}

export default CloudinaryService;
