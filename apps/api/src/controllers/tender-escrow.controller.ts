import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TenderService } from '../services/tender.service';
import { EscrowService } from '../services/escrow.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class TenderEscrowController {
  constructor(
    private tenderService: TenderService,
    private escrowService: EscrowService
  ) {}

  // Tender Management
  @Post('tenders')
  async createTender(@Body() body: any, @Request() req: any) {
    return this.tenderService.createTender(
      req.user.id,
      body.cropName,
      body.quantity,
      body.minQuality,
      new Date(body.deadline)
    );
  }

  @Get('tenders')
  async getTenders(@Request() req: any) {
    return this.tenderService.getTenders();
  }

  @Get('tenders/:id')
  async getTenderStatus(@Param('id') tenderId: string) {
    return this.tenderService.getTenderStatus(tenderId);
  }

  @Post('tenders/:id/close')
  async closeTender(@Param('id') tenderId: string) {
    return this.tenderService.closeTender(tenderId);
  }

  // Bid Management
  @Post('tenders/:id/bids')
  async submitBid(@Param('id') tenderId: string, @Body() body: any, @Request() req: any) {
    return this.tenderService.submitBid(
      tenderId,
      req.user.id,
      body.pricePerUnit,
      body.quantity,
      new Date(body.deliveryDate)
    );
  }

  @Get('tenders/:id/bids')
  async getBidsForTender(@Param('id') tenderId: string) {
    return this.tenderService.getBidsForTender(tenderId);
  }

  @Post('tenders/:id/evaluate-bids')
  async evaluateBids(@Param('id') tenderId: string) {
    return this.tenderService.evaluateBids(tenderId);
  }

  @Post('tenders/:id/award/:bidId')
  async awardTender(@Param('id') tenderId: string, @Param('bidId') bidId: string) {
    return this.tenderService.awardTender(tenderId, bidId);
  }

  // Escrow Management
  @Post('escrow')
  async createEscrowAccount(@Body() body: any, @Request() req: any) {
    return this.escrowService.createEscrowAccount(
      body.orderId,
      req.user.id,
      body.farmerId,
      body.amount
    );
  }

  @Get('escrow/:id')
  async getEscrowStatus(@Param('id') escrowId: string) {
    return this.escrowService.getEscrowStatus(escrowId);
  }

  @Post('escrow/:id/hold')
  async holdFunds(@Param('id') escrowId: string, @Body() body: any) {
    return this.escrowService.holdFunds(escrowId, body.amount);
  }

  @Post('escrow/:id/release')
  async releaseFunds(@Param('id') escrowId: string) {
    return this.escrowService.releaseFunds(escrowId);
  }

  @Get('escrow/:id/history')
  async getTransactionHistory(@Param('id') escrowId: string) {
    return this.escrowService.getTransactionHistory(escrowId);
  }

  // Dispute Management
  @Post('escrow/:id/dispute')
  async initiateDispute(@Param('id') escrowId: string, @Body() body: any, @Request() req: any) {
    return this.escrowService.initiateDispute(escrowId, req.user.id, body.reason);
  }

  @Post('disputes/:id/resolve')
  async resolveDispute(@Param('id') disputeId: string, @Body() body: any) {
    return this.escrowService.resolveDispute(disputeId, body.resolution, body.releaseToFarmer);
  }
}
