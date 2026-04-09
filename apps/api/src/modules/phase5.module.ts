import { Module } from '@nestjs/common';
import { AiQualityShieldService } from '../services/ai-quality-shield.service';
import { VoiceService } from '../services/voice.service';
import { AiChatService } from '../services/ai-chat.service';
import { SearchService } from '../services/search.service';
import { PriceAlertsService } from '../services/price-alerts.service';
import { TenderService } from '../services/tender.service';
import { EscrowService } from '../services/escrow.service';
import { AiController } from '../controllers/ai.controller';
import { SearchController } from '../controllers/search.controller';
import { TenderEscrowController } from '../controllers/tender-escrow.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [
    AiQualityShieldService,
    VoiceService,
    AiChatService,
    SearchService,
    PriceAlertsService,
    TenderService,
    EscrowService,
    PrismaService,
  ],
  controllers: [AiController, SearchController, TenderEscrowController],
  exports: [
    AiQualityShieldService,
    VoiceService,
    AiChatService,
    SearchService,
    PriceAlertsService,
    TenderService,
    EscrowService,
  ],
})
export class Phase5Module {}
