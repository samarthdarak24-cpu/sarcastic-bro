import { Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import * as AWS from 'aws-sdk';

const logger = new Logger('BackupService');

// Backup configuration
export const backupConfig = {
  // Database backup settings
  database: {
    enabled: true,
    schedule: '0 2 * * *', // 2 AM daily
    retention: 30, // days
    location: 's3://backups/database',
    compression: 'gzip',
    encryption: 'AES-256',
  },
  
  // File storage backup settings
  fileStorage: {
    enabled: true,
    schedule: '0 3 * * 0', // 3 AM every Sunday
    retention: 60, // days
    location: 's3://backups/files',
    compression: 'gzip',
  },
  
  // Redis cache backup settings
  redis: {
    enabled: true,
    schedule: '0 4 * * *', // 4 AM daily
    retention: 7, // days
    location: 's3://backups/redis',
  },
};

// Disaster recovery targets
export const drTargets = {
  rto: 4, // Recovery Time Objective in hours
  rpo: 1, // Recovery Point Objective in hours
  
  // Backup locations
  primary: 's3://backups/primary',
  secondary: 's3://backups/secondary',
  
  // Replication settings
  replication: {
    enabled: true,
    regions: ['us-east-1', 'eu-west-1'],
    frequency: 'continuous',
  },
};

// Initialize S3 client for backups
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

// Database backup function
export async function backupDatabase() {
  try {
    logger.log('Starting database backup...');
    
    const timestamp = new Date().toISOString();
    const backupName = `db-backup-${timestamp}.sql.gz`;
    
    // Execute pg_dump command
    const { exec } = require('child_process');
    const command = `pg_dump ${process.env.DATABASE_URL} | gzip > /tmp/${backupName}`;
    
    await new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) reject(error);
        else resolve(null);
      });
    });
    
    // Upload to S3
    const fileContent = require('fs').readFileSync(`/tmp/${backupName}`);
    await s3.putObject({
      Bucket: 'backups',
      Key: `database/${backupName}`,
      Body: fileContent,
      ServerSideEncryption: 'AES256',
    }).promise();
    
    logger.log(`Database backup completed: ${backupName}`);
    
    // Cleanup old backups
    await cleanupOldBackups('database', backupConfig.database.retention);
    
  } catch (error) {
    logger.error('Database backup failed', error);
    throw error;
  }
}

// File storage backup function
export async function backupFileStorage() {
  try {
    logger.log('Starting file storage backup...');
    
    const timestamp = new Date().toISOString();
    const backupName = `files-backup-${timestamp}.tar.gz`;
    
    // Create tar archive of uploaded files
    const { exec } = require('child_process');
    const command = `tar -czf /tmp/${backupName} ${process.env.UPLOAD_DIR || './uploads'}`;
    
    await new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) reject(error);
        else resolve(null);
      });
    });
    
    // Upload to S3
    const fileContent = require('fs').readFileSync(`/tmp/${backupName}`);
    await s3.putObject({
      Bucket: 'backups',
      Key: `files/${backupName}`,
      Body: fileContent,
      ServerSideEncryption: 'AES256',
    }).promise();
    
    logger.log(`File storage backup completed: ${backupName}`);
    
    // Cleanup old backups
    await cleanupOldBackups('files', backupConfig.fileStorage.retention);
    
  } catch (error) {
    logger.error('File storage backup failed', error);
    throw error;
  }
}

// Redis backup function
export async function backupRedis() {
  try {
    logger.log('Starting Redis backup...');
    
    const timestamp = new Date().toISOString();
    const backupName = `redis-backup-${timestamp}.rdb`;
    
    // Execute Redis BGSAVE command
    const redis = require('redis');
    const client = redis.createClient({
      url: process.env.REDIS_URL,
    });
    
    await client.connect();
    await client.bgsave();
    await client.disconnect();
    
    // Upload to S3
    const fileContent = require('fs').readFileSync('/var/lib/redis/dump.rdb');
    await s3.putObject({
      Bucket: 'backups',
      Key: `redis/${backupName}`,
      Body: fileContent,
      ServerSideEncryption: 'AES256',
    }).promise();
    
    logger.log(`Redis backup completed: ${backupName}`);
    
    // Cleanup old backups
    await cleanupOldBackups('redis', backupConfig.redis.retention);
    
  } catch (error) {
    logger.error('Redis backup failed', error);
    throw error;
  }
}

// Cleanup old backups
async function cleanupOldBackups(type: string, retentionDays: number) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const response = await s3.listObjectsV2({
      Bucket: 'backups',
      Prefix: `${type}/`,
    }).promise();
    
    if (!response.Contents) return;
    
    const objectsToDelete = response.Contents
      .filter(obj => obj.LastModified && obj.LastModified < cutoffDate)
      .map(obj => ({ Key: obj.Key! }));
    
    if (objectsToDelete.length > 0) {
      await s3.deleteObjects({
        Bucket: 'backups',
        Delete: { Objects: objectsToDelete },
      }).promise();
      
      logger.log(`Cleaned up ${objectsToDelete.length} old ${type} backups`);
    }
  } catch (error) {
    logger.error(`Cleanup failed for ${type}`, error);
  }
}

// Verify backup integrity
export async function verifyBackup(backupName: string, type: string) {
  try {
    logger.log(`Verifying backup: ${backupName}`);
    
    const response = await s3.headObject({
      Bucket: 'backups',
      Key: `${type}/${backupName}`,
    }).promise();
    
    const isValid = response.ContentLength && response.ContentLength > 0;
    
    if (isValid) {
      logger.log(`Backup verified: ${backupName}`);
    } else {
      logger.error(`Backup verification failed: ${backupName}`);
    }
    
    return isValid;
  } catch (error) {
    logger.error(`Backup verification error: ${backupName}`, error);
    return false;
  }
}

// Restore from backup
export async function restoreFromBackup(backupName: string, type: string) {
  try {
    logger.log(`Starting restore from backup: ${backupName}`);
    
    // Download backup from S3
    const response = await s3.getObject({
      Bucket: 'backups',
      Key: `${type}/${backupName}`,
    }).promise();
    
    const backupData = response.Body as Buffer;
    
    // Restore based on type
    if (type === 'database') {
      await restoreDatabase(backupData);
    } else if (type === 'files') {
      await restoreFileStorage(backupData);
    } else if (type === 'redis') {
      await restoreRedis(backupData);
    }
    
    logger.log(`Restore completed: ${backupName}`);
  } catch (error) {
    logger.error(`Restore failed: ${backupName}`, error);
    throw error;
  }
}

async function restoreDatabase(backupData: Buffer) {
  const { exec } = require('child_process');
  const fs = require('fs');
  
  const tempFile = '/tmp/restore.sql.gz';
  fs.writeFileSync(tempFile, backupData);
  
  const command = `gunzip -c ${tempFile} | psql ${process.env.DATABASE_URL}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(null);
    });
  });
}

async function restoreFileStorage(backupData: Buffer) {
  const { exec } = require('child_process');
  const fs = require('fs');
  
  const tempFile = '/tmp/restore.tar.gz';
  fs.writeFileSync(tempFile, backupData);
  
  const command = `tar -xzf ${tempFile} -C ${process.env.UPLOAD_DIR || './uploads'}`;
  
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(null);
    });
  });
}

async function restoreRedis(backupData: Buffer) {
  const fs = require('fs');
  fs.writeFileSync('/var/lib/redis/dump.rdb', backupData);
  
  const redis = require('redis');
  const client = redis.createClient({
    url: process.env.REDIS_URL,
  });
  
  await client.connect();
  await client.flushAll();
  await client.disconnect();
}

// Initialize backup schedules
export function initializeBackupSchedules() {
  // Database backup
  if (backupConfig.database.enabled) {
    cron.schedule(backupConfig.database.schedule, async () => {
      try {
        await backupDatabase();
      } catch (error) {
        logger.error('Scheduled database backup failed', error);
      }
    });
    logger.log('Database backup schedule initialized');
  }
  
  // File storage backup
  if (backupConfig.fileStorage.enabled) {
    cron.schedule(backupConfig.fileStorage.schedule, async () => {
      try {
        await backupFileStorage();
      } catch (error) {
        logger.error('Scheduled file storage backup failed', error);
      }
    });
    logger.log('File storage backup schedule initialized');
  }
  
  // Redis backup
  if (backupConfig.redis.enabled) {
    cron.schedule(backupConfig.redis.schedule, async () => {
      try {
        await backupRedis();
      } catch (error) {
        logger.error('Scheduled Redis backup failed', error);
      }
    });
    logger.log('Redis backup schedule initialized');
  }
}

// Disaster recovery runbook
export const disasterRecoveryRunbook = `
# Disaster Recovery Runbook

## RTO: 4 hours | RPO: 1 hour

### Database Recovery
1. Stop all application services
2. Restore database from latest backup: \`restoreFromBackup('db-backup-*.sql.gz', 'database')\`
3. Verify data integrity
4. Restart application services

### File Storage Recovery
1. Restore files from latest backup: \`restoreFromBackup('files-backup-*.tar.gz', 'files')\`
2. Verify file integrity
3. Update CDN cache

### Redis Cache Recovery
1. Restore Redis from latest backup: \`restoreFromBackup('redis-backup-*.rdb', 'redis')\`
2. Verify cache data
3. Restart cache-dependent services

### Full System Recovery
1. Execute database recovery steps
2. Execute file storage recovery steps
3. Execute Redis cache recovery steps
4. Run health checks
5. Monitor system for 1 hour
`;
