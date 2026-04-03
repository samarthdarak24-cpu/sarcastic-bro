import { Client } from "@elastic/elasticsearch";
import { env } from "../../config/env";

// Configure Elasticsearch Client (using a mock fallback if not configured for hackathon demo sake)
const elasticClient = new Client({
  node: env.ELASTICSEARCH_URL || "http://localhost:9200",
});

const PRODUCT_INDEX = "products";

export class SearchService {
  /**
   * Initializes the index settings and mappings
   */
  static async initializeIndex() {
    try {
      const indexExists = await elasticClient.indices.exists({ index: PRODUCT_INDEX });
      if (!indexExists) {
        await elasticClient.indices.create({
          index: PRODUCT_INDEX,
          mappings: {
            properties: {
              id: { type: "keyword" },
              name: { type: "text", analyzer: "standard" },
              description: { type: "text" },
              category: { type: "keyword" },
              district: { type: "keyword" },
              state: { type: "keyword" },
              price: { type: "double" },
              farmerId: { type: "keyword" },
              isODOP: { type: "boolean" },
              isActive: { type: "boolean" },
            },
          },
        });
        console.log(`[ES] Index '${PRODUCT_INDEX}' created`);
      }
    } catch (e) {
      console.warn(`[ES] Skipping ES Init, ensure Elasticsearch is running.`);
    }
  }

  /**
   * Index a product into Elasticsearch whenever created or updated
   */
  static async indexProduct(product: any) {
    try {
      await elasticClient.index({
        index: PRODUCT_INDEX,
        id: product.id,
        document: {
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          district: product.district,
          state: product.state,
          price: product.price,
          farmerId: product.farmerId,
          isODOP: product.isODOP,
          isActive: product.isActive,
        },
        refresh: true, // For immediate searchability (dev environment)
      });
    } catch (e) {
      console.warn(`[ES] Failed to index product ${product.id}`);
    }
  }

  /**
   * Remove product from index
   */
  static async removeProduct(id: string) {
    try {
      await elasticClient.delete({ index: PRODUCT_INDEX, id });
    } catch (e) {
      console.warn(`[ES] Failed to remove product ${id}`);
    }
  }

  /**
   * Full-text search with aggregations for filtering
   */
  static async searchProducts(query: string, rawFilters?: any) {
    try {
      const mustClauses: any[] = [{ match: { isActive: true } }];
      const filterClauses: any[] = [];

      if (query && query.trim() !== "") {
        mustClauses.push({
          multi_match: {
            query,
            fields: ["name^3", "description^1", "category^2"],
            fuzziness: "AUTO",
          },
        });
      }

      // Exact Filters
      if (rawFilters?.category) filterClauses.push({ term: { category: rawFilters.category } });
      if (rawFilters?.district) filterClauses.push({ term: { district: rawFilters.district } });
      
      // Range Filters
      if (rawFilters?.minPrice !== undefined || rawFilters?.maxPrice !== undefined) {
        const rangeObj: any = {};
        if (rawFilters?.minPrice !== undefined) rangeObj.gte = Number(rawFilters.minPrice);
        if (rawFilters?.maxPrice !== undefined) rangeObj.lte = Number(rawFilters.maxPrice);
        filterClauses.push({ range: { price: rangeObj } });
      }

      // Aggregations mapping
      const aggs = {
        categories: { terms: { field: "category", size: 20 } },
        priceStats: { stats: { field: "price" } },
      };

      const esResponse = await elasticClient.search({
        index: PRODUCT_INDEX,
        query: {
          bool: {
            must: mustClauses,
            filter: filterClauses,
          },
        },
        aggregations: aggs,
        size: 50, // Limit direct hits
      });

      return {
        hits: esResponse.hits.hits.map((h: any) => h._source),
        total: (esResponse.hits.total as any).value,
        facets: esResponse.aggregations,
      };
    } catch (error) {
      console.warn(`[ES] Search failed: `, error);
      // Mock fallback response for hackathon environments where ES is not installed
      return {
        hits: [],
        total: 0,
        facets: {},
        warning: "Elasticsearch not connected, returning empty mock.",
      };
    }
  }
}

// Initialize on startup asynchronously without blocking
SearchService.initializeIndex();
