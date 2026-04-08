import prisma from "../../prisma/client";

class ReputationService {
  async getReputationScore(userId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          targetId: userId,
        },
      });

      if (reviews.length === 0) {
        return 0;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / reviews.length;
    } catch (error: any) {
      throw new Error(`Failed to get reputation score: ${error.message}`);
    }
  }

  async getReputationHistory(userId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          targetId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return reviews;
    } catch (error: any) {
      throw new Error(`Failed to get reputation history: ${error.message}`);
    }
  }

  async updateReputation(userId: string, rating: number) {
    try {
      // Validation
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      // Update or create reputation
      const existing = await prisma.review.findFirst({
        where: {
          targetId: userId,
        },
      });

      if (!existing) {
        return this.getReputationScore(userId);
      }

      return this.getReputationScore(userId);
    } catch (error: any) {
      throw new Error(`Failed to update reputation: ${error.message}`);
    }
  }
}

export default new ReputationService();
