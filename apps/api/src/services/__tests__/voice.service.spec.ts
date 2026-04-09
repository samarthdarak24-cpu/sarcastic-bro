import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from '../voice.service';

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceService],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
  });

  describe('transcribeAudio', () => {
    it('should transcribe audio to text in English', async () => {
      const result = await service.transcribeAudio('/path/to/audio.wav', 'en');

      expect(typeof result).toBe('string');
    });

    it('should transcribe audio to text in Hindi', async () => {
      const result = await service.transcribeAudio('/path/to/audio.wav', 'hi');

      expect(typeof result).toBe('string');
    });

    it('should transcribe audio to text in Marathi', async () => {
      const result = await service.transcribeAudio('/path/to/audio.wav', 'mr');

      expect(typeof result).toBe('string');
    });
  });

  describe('synthesizeText', () => {
    it('should synthesize text to speech in English', async () => {
      const result = await service.synthesizeText('Hello, how can I help?', 'en');

      expect(typeof result).toBe('string');
      expect(result).toContain('http');
    });

    it('should synthesize text to speech in Hindi', async () => {
      const result = await service.synthesizeText('नमस्ते', 'hi');

      expect(typeof result).toBe('string');
    });

    it('should synthesize text to speech in Marathi', async () => {
      const result = await service.synthesizeText('नमस्कार', 'mr');

      expect(typeof result).toBe('string');
    });
  });

  describe('parseVoiceCommand', () => {
    it('should parse search command', async () => {
      const result = await service.parseVoiceCommand('Search for wheat in Punjab', 'en');

      expect(result.command).toBe('search');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.parameters.product).toBe('wheat');
      expect(result.parameters.location).toBe('Punjab');
    });

    it('should parse order command', async () => {
      const result = await service.parseVoiceCommand('Order 50 kg of rice', 'en');

      expect(result.command).toBe('order');
      expect(result.parameters.quantity).toBe(50);
    });

    it('should parse price command', async () => {
      const result = await service.parseVoiceCommand('What is the price of wheat?', 'en');

      expect(result.command).toBe('price');
    });

    it('should parse quality command', async () => {
      const result = await service.parseVoiceCommand('Check the quality of this crop', 'en');

      expect(result.command).toBe('quality');
    });

    it('should parse chat command', async () => {
      const result = await service.parseVoiceCommand('Send a message to the farmer', 'en');

      expect(result.command).toBe('chat');
    });

    it('should parse track command', async () => {
      const result = await service.parseVoiceCommand('Track my order status', 'en');

      expect(result.command).toBe('track');
    });
  });

  describe('recordVoiceMessage', () => {
    it('should record voice message', async () => {
      const result = await service.recordVoiceMessage(10, 'en');

      expect(result).toBeDefined();
      expect(result.duration).toBe(10);
      expect(result.language).toBe('en');
    });
  });

  describe('detectLanguage', () => {
    it('should detect English language', async () => {
      const result = await service.detectLanguage('/path/to/english.wav');

      expect(['en', 'hi', 'mr']).toContain(result);
    });

    it('should detect Hindi language', async () => {
      const result = await service.detectLanguage('/path/to/hindi.wav');

      expect(['en', 'hi', 'mr']).toContain(result);
    });

    it('should detect Marathi language', async () => {
      const result = await service.detectLanguage('/path/to/marathi.wav');

      expect(['en', 'hi', 'mr']).toContain(result);
    });
  });

  describe('compressAudio', () => {
    it('should compress audio file', async () => {
      const result = await service.compressAudio('/path/to/audio.wav');

      expect(typeof result).toBe('string');
    });
  });
});
