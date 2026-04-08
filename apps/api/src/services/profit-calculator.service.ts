/**
 * Profit Calculator Service
 * Comprehensive profit analysis for local vs export sales
 */

import { MandiPricesService } from "./mandi-prices.service";
import { GlobalPricesService } from "./global-prices.service";

export interface ProfitCalculation {
  crop: string;
  quantity: number;
  unit: string;
  localSale: LocalSaleDetails;
  exportSale: ExportSaleDetails;
  comparison: ProfitComparison;
  recommendation: string;
  breakEvenPoint: number;
}

export interface LocalSaleDetails {
  mandiPrice: number;
  transportCost: number;
  commissionRate: number;
  commissionAmount: number;
  otherCosts: number;
  totalCost: number;
  netRevenue: number;
  profitPerUnit: number;
  totalProfit: number;
}

export interface ExportSaleDetails {
  exportPrice: number;
  exportCosts: {
    exportDuty: number;
    certification: number;
    packaging: number;
    documentation: number;
    totalExportProcessing: number;
  };
  logistics: {
    domesticTransport: number;
    domesticStorageFee: number;
    shipment: number;
    insurance: number;
    customsClearance: number;
    totalLogistics: number;
  };
  currencyConversion: {
    currency: string;
    exchangeRate: number;
    priceInINR: number;
  };
  totalCost: number;
  netRevenue: number;
  profitPerUnit: number;
  totalProfit: number;
}

export interface ProfitComparison {
  profitDifference: number;
  profitMarginLocal: number;
  profitMarginExport: number;
  profitDifferencePercentage: number;
  paybackPeriod: string;
  riskFactors: string[];
  timeToExpectedReturn: string;
}

export class ProfitCalculatorService {
  /**
   * Calculate detailed profit comparison
   */
  static async calculateProfit(
    crop: string,
    quantity: number, // in quintals
    destinationCountry?: string,
    farmState?: string
  ): Promise<ProfitCalculation> {
    try {
      // Get current mandi price
      const mandiData = await MandiPricesService.fetchMandiPrices(crop, farmState);
      const mandiPrice = mandiData.prices[0]?.price || 2000;

      // Get global prices
      const globalData = await GlobalPricesService.getGlobalPriceComparison(crop, mandiPrice);
      const selectedMarket = destinationCountry
        ? globalData.globalMarkets.find(m => m.country === destinationCountry)
        : globalData.globalMarkets[0];

      if (!selectedMarket) {
        throw new Error(`Unable to find market data for ${destinationCountry}`);
      }

      // Calculate local sale
      const localSale = this.calculateLocalSale(crop, quantity, mandiPrice);

      // Calculate export sale
      const exportSale = await this.calculateExportSale(
        crop,
        quantity,
        selectedMarket,
        mandiPrice
      );

      // Compare
      const comparison = this.compareProfit(localSale, exportSale);

      // Generate recommendation
      const recommendation =
        exportSale.totalProfit > localSale.totalProfit
          ? `Export to ${selectedMarket.country} is ₹${Math.round(
              exportSale.totalProfit - localSale.totalProfit
            )} more profitable`
          : `Local sale through mandi is ₹${Math.round(
              localSale.totalProfit - exportSale.totalProfit
            )} more profitable`;

      // Calculate break-even quantity
      const breakEvenPoint =
        localSale.profitPerUnit > 0
          ? Math.round(
              (exportSale.totalCost - localSale.totalCost) /
                (localSale.profitPerUnit - exportSale.profitPerUnit)
            )
          : quantity;

      return {
        crop,
        quantity,
        unit: 'quintals',
        localSale,
        exportSale,
        comparison,
        recommendation,
        breakEvenPoint: Math.max(0, breakEvenPoint),
      };
    } catch (error: any) {
      console.error('[ProfitCalculator] Error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate local sale profit
   */
  private static calculateLocalSale(
    crop: string,
    quantity: number,
    mandiPrice: number
  ): LocalSaleDetails {
    // Transport to mandi (approx ₹200-300 per quintal)
    const transportCost = quantity * 250;

    // Mandi commission (typically 6-8%)
    const commissionRate = 0.07;
    const commissionAmount = mandiPrice * quantity * commissionRate;

    // Other costs (weighing, loading, etc.)
    const otherCosts = quantity * 50;

    const totalCost = transportCost + commissionAmount + otherCosts;
    const totalRevenue = mandiPrice * quantity;
    const netRevenue = totalRevenue - totalCost;
    const profitPerUnit = mandiPrice - (totalCost / quantity);
    const totalProfit = netRevenue - totalRevenue;

    return {
      mandiPrice,
      transportCost,
      commissionRate: commissionRate * 100,
      commissionAmount,
      otherCosts,
      totalCost,
      netRevenue,
      profitPerUnit,
      totalProfit: -totalCost, // Loss because we're subtracting costs
    };
  }

  /**
   * Calculate export sale profit
   */
  private static async calculateExportSale(
    crop: string,
    quantity: number,
    market: any,
    mandiPrice: number
  ): Promise<ExportSaleDetails> {
    // Export processing costs
    const exportDuty = mandiPrice * quantity * 0.01; // 1% export duty
    const certification = Math.max(5000, quantity * 100); // ₹100/quintal or min ₹5000
    const packaging = quantity * 300; // ₹300 per quintal
    const documentation = 2000; // Fixed cost

    const exportCosts = {
      exportDuty,
      certification,
      packaging,
      documentation,
      totalExportProcessing: exportDuty + certification + packaging + documentation,
    };

    // Logistics costs (more detailed)
    const domesticTransport = quantity * 300; // Transport to port/warehouse
    const domesticStorageFee = quantity * 25; // Storage per quintal per day
    const shipment = quantity * 1500; // Ocean freight
    const insurance = (shipment * 0.02); // 2% of shipment
    const customsClearance = 3000; // Fixed customs clearance cost

    const logistics = {
      domesticTransport,
      domesticStorageFee,
      shipment,
      insurance,
      customsClearance,
      totalLogistics:
        domesticTransport + domesticStorageFee + shipment + insurance + customsClearance,
    };

    // Currency conversion
    const forexRates = await GlobalPricesService.getForexRates();
    const rate = forexRates[market.currencyCode] || 1;

    const currencyConversion = {
      currency: market.currency,
      exchangeRate: rate,
      priceInINR: market.finalPrice,
    };

    // Total costs and profit
    const totalCost =
      exportCosts.totalExportProcessing + logistics.totalLogistics;
    const totalRevenue = market.finalPrice * quantity;
    const netRevenue = totalRevenue - totalCost;
    const profitPerUnit = market.finalPrice - (totalCost / quantity);
    const totalProfit = netRevenue;

    return {
      exportPrice: market.pricePerQuintal,
      exportCosts,
      logistics,
      currencyConversion,
      totalCost,
      netRevenue,
      profitPerUnit,
      totalProfit,
    };
  }

  /**
   * Compare local vs export profit
   */
  private static compareProfit(
    localSale: LocalSaleDetails,
    exportSale: ExportSaleDetails
  ): ProfitComparison {
    const profitDifference = exportSale.totalProfit - localSale.totalProfit;
    const profitMarginLocal =
      (localSale.totalProfit / (localSale.totalProfit + localSale.totalCost)) * 100 || 0;
    const profitMarginExport =
      (exportSale.totalProfit / (exportSale.totalProfit + exportSale.totalCost)) * 100 || 0;
    const profitDifferencePercentage = profitMarginExport - profitMarginLocal;

    const riskFactors = [];
    if (exportSale.totalCost > 100000) {
      riskFactors.push('High upfront costs');
    }
    if (exportSale.logistics.shipment > 50000) {
      riskFactors.push('Significant logistics investment');
    }
    riskFactors.push('Currency exchange risk');
    riskFactors.push('Regulatory and compliance risk');

    // Estimate ROI timeline
    let timeToExpectedReturn = 'Immediate';
    if (profitDifference > 0) {
      const daysToBreakEven = Math.ceil(exportSale.totalCost / (profitDifference / 30));
      timeToExpectedReturn = `${daysToBreakEven} days to recoup additional investment`;
    }

    return {
      profitDifference: Math.round(profitDifference),
      profitMarginLocal: Math.round(profitMarginLocal * 100) / 100,
      profitMarginExport: Math.round(profitMarginExport * 100) / 100,
      profitDifferencePercentage: Math.round(profitDifferencePercentage * 100) / 100,
      paybackPeriod: timeToExpectedReturn,
      riskFactors,
      timeToExpectedReturn,
    };
  }

  /**
   * Sensitivity analysis - show profit at different price points
   */
  static async getSensitivityAnalysis(
    crop: string,
    quantity: number,
    destinationCountry: string,
    priceRange: { min: number; max: number }
  ) {
    try {
      const scenarios = [];

      // Calculate at different price points
      for (let price = priceRange.min; price <= priceRange.max; price += 500) {
        const mandiData = await MandiPricesService.fetchMandiPrices(crop);
        const globalData = await GlobalPricesService.getGlobalPriceComparison(crop, mandiData.prices[0]?.price || 2000);
        
        const market = globalData.globalMarkets.find(
          m => m.country === destinationCountry
        );

        if (market) {
          const localSale = this.calculateLocalSale(crop, quantity, price);
          const exportSale = await this.calculateExportSale(
            crop,
            quantity,
            { ...market, finalPrice: price },
            price
          );

          scenarios.push({
            price,
            localProfit: localSale.totalProfit,
            exportProfit: exportSale.totalProfit,
            difference: exportSale.totalProfit - localSale.totalProfit,
            isBetter: exportSale.totalProfit > localSale.totalProfit ? 'Export' : 'Local',
          });
        }
      }

      return scenarios;
    } catch (error: any) {
      console.error('[Sensitivity Analysis] Error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate optimal export quantity
   */
  static async getOptimalExportQuantity(
    crop: string,
    availableQuantity: number,
    maxBudget: number,
    destinationCountry: string
  ) {
    try {
      const mandiData = await MandiPricesService.fetchMandiPrices(crop);
      const mandiPrice = mandiData.prices[0]?.price || 2000;

      const globalData = await GlobalPricesService.getGlobalPriceComparison(crop, mandiPrice);
      const market = globalData.globalMarkets.find(m => m.country === destinationCountry);

      if (!market) {
        throw new Error(`Market not found for ${destinationCountry}`);
      }

      // Binary search for optimal quantity
      let low = 1;
      let high = availableQuantity;
      let optimalQuantity = 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const exportSale = await this.calculateExportSale(crop, mid, market, mandiPrice);

        if (exportSale.totalCost <= maxBudget) {
          optimalQuantity = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const finalCalc = await this.calculateProfit(crop, optimalQuantity, destinationCountry);

      return {
        optimalQuantity,
        estimatedCost: finalCalc.exportSale.totalCost,
        estimatedProfit: finalCalc.exportSale.totalProfit,
        profitPerUnit: finalCalc.exportSale.profitPerUnit,
      };
    } catch (error: any) {
      console.error('[Optimal Quantity] Error:', error.message);
      throw error;
    }
  }

  /**
   * Multi-country profit comparison
   */
  static async multicountryComparison(
    crop: string,
    quantity: number,
    countries: string[]
  ): Promise<any[]> {
    try {
      const mandiData = await MandiPricesService.fetchMandiPrices(crop);
      const mandiPrice = mandiData.prices[0]?.price || 2000;

      const globalData = await GlobalPricesService.getGlobalPriceComparison(crop, mandiPrice);
      const localSale = this.calculateLocalSale(crop, quantity, mandiPrice);

      const comparisons = [];

      for (const country of countries) {
        const market = globalData.globalMarkets.find(m => m.country === country);
        if (market) {
          const exportSale = await this.calculateExportSale(crop, quantity, market, mandiPrice);
          comparisons.push({
            country,
            exportProfit: Math.round(exportSale.totalProfit),
            exportCost: Math.round(exportSale.totalCost),
            localProfit: Math.round(localSale.totalProfit),
            difference: Math.round(exportSale.totalProfit - localSale.totalProfit),
            isBetter: exportSale.totalProfit > localSale.totalProfit,
            profitMargin: Math.round(
              ((exportSale.totalProfit) / (exportSale.totalRevenue)) * 100
            ),
          });
        }
      }

      return comparisons.sort((a, b) => b.difference - a.difference);
    } catch (error: any) {
      console.error('[Multicountry Comparison] Error:', error.message);
      throw error;
    }
  }
}
