import { BlockchainTraceCoreService } from './blockchain-trace-core.service';

/**
 * BlockchainTraceService adapter for the Order Module
 * providing the addTraceEvent method expected by the Order Service
 */
export default class BlockchainTraceService {
  static async addTraceEvent(data: {
    productId: string;
    farmerId: string;
    eventType: 'SEED' | 'CULTIVATION' | 'HARVEST' | 'QUALITY' | 'LOGISTICS' | 'DELIVERED';
    location?: string;
    qualityGrade?: string;
    metadata?: any;
  }) {
    return BlockchainTraceCoreService.createTraceEvent(data);
  }
}
