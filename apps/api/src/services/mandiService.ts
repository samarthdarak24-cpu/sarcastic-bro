import { getSocketService } from "./socketService";

export class MandiRealtimeService {
  private static interval: NodeJS.Timeout | null = null;

  static startSimulation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const socketService = getSocketService();
      
      // Simulate random price updates for key commodities
      const commodities = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Turmeric'];
      const commodity = commodities[Math.floor(Math.random() * commodities.length)];
      
      const priceUpdate = {
        commodity,
        newPrice: 2000 + Math.floor(Math.random() * 8000),
        change: Math.floor(Math.random() * 200) - 100,
        market: 'Regional Mandi'
      };

      // Broadcast to everyone
      socketService.broadcastAnnouncement({
        title: `Live Price: ${commodity}`,
        message: `New price in ${priceUpdate.market}: ₹${priceUpdate.newPrice}`,
        type: priceUpdate.change >= 0 ? 'success' : 'warning',
        priority: 'low'
      });

      console.log(`[Simulator] Mandi update emitted for ${commodity}`);
    }, 15000); // Every 15 seconds
  }

  static stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
