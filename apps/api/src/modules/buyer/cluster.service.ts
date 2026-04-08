import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClusterService {
  async getClusters(filters: {
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    category?: string;
    minRating?: number;
  }) {
    const { bounds, category, minRating } = filters;

    // Get suppliers with their locations
    const suppliers = await prisma.supplier.findMany({
      where: {
        isActive: true,
        rating: minRating ? { gte: minRating } : undefined
      },
      include: {
        bulkProducts: {
          where: { isActive: true },
          select: { category: true, quantity: true }
        }
      }
    });

    // Group suppliers by geographic clusters
    const clusters = this.groupSuppliersByClusters(suppliers, bounds);

    return {
      clusters,
      totalClusters: clusters.length,
      totalSuppliers: suppliers.length,
      generatedAt: new Date()
    };
  }

  async getClusterIntelligence(filters: {
    category?: string;
    location?: string;
  }) {
    const { category, location } = filters;

    // Get suppliers in the location
    const suppliers = await prisma.supplier.findMany({
      where: {
        isActive: true,
        district: location ? { contains: location } : undefined
      },
      include: {
        bulkProducts: {
          where: { isActive: true }
        }
      }
    });

    // Get orders from these suppliers
    const orders = await prisma.order.findMany({
      where: {
        farmerId: {
          in: suppliers.map(s => s.userId)
        }
      }
    });

    // Calculate cluster metrics
    const clusterMetrics = {
      totalSuppliers: suppliers.length,
      avgRating: suppliers.length > 0
        ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
        : 0,
      avgDeliveryTime: this.calculateAvgDeliveryTime(orders),
      avgPrice: orders.length > 0
        ? orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length
        : 0,
      totalProducts: suppliers.reduce((sum, s) => sum + s.bulkProducts.length, 0),
      competitiveness: this.calculateCompetitiveness(suppliers),
      reliability: this.calculateReliability(orders)
    };

    // Get top suppliers in cluster
    const topSuppliers = suppliers
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        name: s.name,
        rating: s.rating,
        productsCount: s.bulkProducts.length,
        location: `${s.district}, ${s.state}`
      }));

    return {
      location: location || 'All',
      category: category || 'All',
      metrics: clusterMetrics,
      topSuppliers,
      generatedAt: new Date()
    };
  }

  async getClusterMap(filters: {
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    category?: string;
  }) {
    const { bounds, category } = filters;

    // Get suppliers with their locations
    const suppliers = await prisma.supplier.findMany({
      where: {
        isActive: true
      },
      include: {
        bulkProducts: {
          where: { isActive: true },
          select: { category: true, quantity: true }
        }
      }
    });

    // Create map markers
    const markers = suppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      lat: this.generateLatitude(supplier.district),
      lng: this.generateLongitude(supplier.state),
      rating: supplier.rating,
      productsCount: supplier.bulkProducts.length,
      clusterSize: this.getClusterSize(supplier.rating),
      color: this.getClusterColor(supplier.rating)
    }));

    // Group markers into clusters
    const clusteredMarkers = this.clusterMarkers(markers);

    return {
      markers: clusteredMarkers,
      bounds: bounds || {
        north: 35.5,
        south: 8.0,
        east: 97.5,
        west: 68.0
      },
      zoom: 5,
      generatedAt: new Date()
    };
  }

  private groupSuppliersByClusters(suppliers: any[], bounds?: any) {
    // Simple clustering by district
    const clusterMap: { [key: string]: any[] } = {};

    suppliers.forEach(supplier => {
      const key = supplier.district || 'Unknown';
      if (!clusterMap[key]) {
        clusterMap[key] = [];
      }
      clusterMap[key].push(supplier);
    });

    return Object.entries(clusterMap).map(([district, supplierList]) => ({
      id: district,
      name: district,
      location: district,
      supplierCount: supplierList.length,
      avgRating: supplierList.reduce((sum, s) => sum + s.rating, 0) / supplierList.length,
      totalProducts: supplierList.reduce((sum, s) => sum + s.bulkProducts.length, 0),
      suppliers: supplierList.map(s => ({
        id: s.id,
        name: s.name,
        rating: s.rating
      }))
    }));
  }

  private calculateAvgDeliveryTime(orders: any[]): number {
    if (orders.length === 0) return 0;

    const deliveredOrders = orders.filter(o => o.deliveredAt);
    if (deliveredOrders.length === 0) return 0;

    const totalDays = deliveredOrders.reduce((sum, o) => {
      const days = Math.floor((o.deliveredAt.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / deliveredOrders.length);
  }

  private calculateCompetitiveness(suppliers: any[]): number {
    if (suppliers.length === 0) return 0;

    // Higher number of suppliers = more competitive
    const competitiveness = Math.min(suppliers.length / 10, 1.0);
    return Math.round(competitiveness * 100);
  }

  private calculateReliability(orders: any[]): number {
    if (orders.length === 0) return 0;

    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    return Math.round((completedOrders / orders.length) * 100);
  }

  private generateLatitude(district: string): number {
    // Mock latitude based on district
    const latitudes: { [key: string]: number } = {
      'Maharashtra': 19.7515,
      'Gujarat': 22.2587,
      'Punjab': 31.1471,
      'Haryana': 29.0588,
      'Uttar Pradesh': 26.8467,
      'Madhya Pradesh': 22.9375,
      'Karnataka': 15.3173,
      'Tamil Nadu': 11.1271,
      'Telangana': 15.3173,
      'Andhra Pradesh': 15.9129
    };
    return latitudes[district] || 20.0;
  }

  private generateLongitude(state: string): number {
    // Mock longitude based on state
    const longitudes: { [key: string]: number } = {
      'Maharashtra': 75.7139,
      'Gujarat': 71.1924,
      'Punjab': 75.3412,
      'Haryana': 77.0493,
      'Uttar Pradesh': 80.9462,
      'Madhya Pradesh': 78.6569,
      'Karnataka': 75.7139,
      'Tamil Nadu': 79.7064,
      'Telangana': 78.4744,
      'Andhra Pradesh': 79.7064
    };
    return longitudes[state] || 75.0;
  }

  private getClusterSize(rating: number): string {
    if (rating >= 4.5) return 'large';
    if (rating >= 4.0) return 'medium';
    return 'small';
  }

  private getClusterColor(rating: number): string {
    if (rating >= 4.5) return '#10b981'; // Green
    if (rating >= 4.0) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }

  private clusterMarkers(markers: any[]): any[] {
    // Simple clustering: group nearby markers
    const clustered: any[] = [];
    const processed = new Set<string>();

    markers.forEach(marker => {
      if (processed.has(marker.id)) return;

      const cluster = [marker];
      processed.add(marker.id);

      markers.forEach(other => {
        if (processed.has(other.id)) return;

        // Simple distance check (in degrees)
        const distance = Math.sqrt(
          Math.pow(marker.lat - other.lat, 2) + Math.pow(marker.lng - other.lng, 2)
        );

        if (distance < 2) {
          cluster.push(other);
          processed.add(other.id);
        }
      });

      if (cluster.length > 1) {
        clustered.push({
          type: 'cluster',
          count: cluster.length,
          lat: cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length,
          lng: cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length,
          markers: cluster
        });
      } else {
        clustered.push(marker);
      }
    });

    return clustered;
  }
}
