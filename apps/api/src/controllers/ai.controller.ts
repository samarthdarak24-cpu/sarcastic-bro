import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AiQualityShieldService } from '../services/ai-quality-shield.service';
import { AiChatService } from '../services/ai-chat.service';
import { VoiceService } from '../services/voice.service';

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private qualityService: AiQualityShieldService,
    private chatService: AiChatService,
    private voiceService: VoiceService
  ) {}

  // Quality Analysis
  @Post('quality-analysis')
  async analyzeQuality(@Body() body: any, @Request() req: any) {
    return this.qualityService.analyzeQuality(body.imagePath, body.productId);
  }

  @Post('defect-detection')
  async detectDefects(@Body() body: any) {
    return this.qualityService.detectDefects(body.imagePath);
  }

  // Chat
  @Post('chat')
  async chat(@Body() body: any, @Request() req: any) {
    return this.chatService.chat(req.user.id, body.message, body.language || 'en');
  }

  @Get('chat/price-recommendation/:crop/:location')
  async getPriceRecommendation(@Param('crop') crop: string, @Param('location') location: string) {
    return this.chatService.getMarketPriceRecommendation(crop, location);
  }

  @Get('chat/crop-recommendation')
  async getCropRecommendation(@Request() req: any) {
    return this.chatService.getCropRecommendation(req.user.id, req.query.language || 'en');
  }

  @Post('chat/quality-explanation')
  async explainQuality(@Body() body: any) {
    return this.chatService.explainQualityGrade(body.grade, body.defects, body.language || 'en');
  }

  // Voice
  @Post('voice/transcribe')
  async transcribeAudio(@Body() body: any) {
    return this.voiceService.transcribeAudio(body.audioPath, body.language || 'en');
  }

  @Post('voice/synthesize')
  async synthesizeText(@Body() body: any) {
    return this.voiceService.synthesizeText(body.text, body.language || 'en');
  }

  @Post('voice/parse-command')
  async parseVoiceCommand(@Body() body: any) {
    return this.voiceService.parseVoiceCommand(body.transcript, body.language || 'en');
  }

  @Post('voice/record')
  async recordVoiceMessage(@Body() body: any) {
    return this.voiceService.recordVoiceMessage(body.duration, body.language || 'en');
  }

  @Post('voice/detect-language')
  async detectLanguage(@Body() body: any) {
    return this.voiceService.detectLanguage(body.audioPath);
  }
}
