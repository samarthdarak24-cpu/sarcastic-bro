import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SearchService } from '../services/search.service';
import { PriceAlertsService } from '../services/price-alerts.service';

@Controller('api/search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(
    private searchService: SearchService,
    private priceAlertsService: PriceAlertsService
  ) {}

  // Search
  @Get()
  async search(@Query() filters: any) {
    return this.searchService.search(filters, filters.limit || 20, filters.offset || 0);
  }

  @Get('keyword')
  async searchByKeyword(@Query('q') keyword: string) {
    return this.searchService.searchByKeyword(keyword);
  }

  @Get('price-range')
  async filterByPriceRange(@Query('min') min: number, @Query('max') max: number) {
    return this.searchService.filterByPriceRange(min, max);
  }

  @Get('location')
  async filterByLocation(@Query('location') location: string, @Query('distance') distance: number) {
    return this.searchService.filterByLocation(location, distance);
  }

  @Get('grade')
  async filterByGrade(@Query('grade') grade: string) {
    return this.searchService.filterByGrade(grade);
  }

  @Get('category')
  async filterByCategory(@Query('category') category: string) {
    return this.searchService.filterByCategory(category);
  }

  @Post('save')
  async saveSearch(@Body() body: any, @Request() req: any) {
    return this.searchService.saveSearch(req.user.id, body.filters, body.name);
  }

  @Get('saved')
  async getSavedSearches(@Request() req: any) {
    return this.searchService.getSavedSearches(req.user.id);
  }

  // Price Alerts
  @Post('price-alert')
  async createPriceAlert(@Body() body: any, @Request() req: any) {
    return this.priceAlertsService.createPriceAlert(
      req.user.id,
      body.cropName,
      body.targetPrice,
      body.alertType
    );
  }

  @Get('price-alerts')
  async getPriceAlerts(@Request() req: any) {
    return this.priceAlertsService.getPriceAlerts(req.user.id);
  }

  @Post('price-alert/:id/delete')
  async deletePriceAlert(@Request() req: any) {
    return this.priceAlertsService.deletePriceAlert(req.params.id);
  }

  // Recommendations
  @Get('recommendations')
  async getRecommendations(@Request() req: any) {
    return this.priceAlertsService.getRecommendations(req.user.id);
  }

  @Post('recommendations/personalize')
  async personalizeRecommendations(@Body() body: any, @Request() req: any) {
    return this.priceAlertsService.personalizeRecommendations(req.user.id, body.preferences);
  }

  @Post('recommendations/deliver')
  async deliverRecommendations(@Body() body: any, @Request() req: any) {
    return this.priceAlertsService.deliverRecommendations(req.user.id, body.recommendations);
  }
}
