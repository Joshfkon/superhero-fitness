import { db } from "@/lib/db";

// Define a proper type for training data
interface TrainingData {
  content: string;
  category?: string;
  metadata?: Record<string, any>;
  // Add other fields as needed
}

export const aiTrainingService = {
  /**
   * Get all training data
   * @returns Promise containing all training data entries
   */
  getAllTrainingData: async () => {
    try {
      return await db.aiTraining.findMany();
    } catch (error) {
      console.error("Failed to fetch training data:", error);
      throw error;
    }
  },
  
  /**
   * Get training data by ID
   * @param id The unique identifier of the training data
   * @returns Promise containing the training data entry or null if not found
   */
  getTrainingDataById: async (id: string) => {
    try {
      return await db.aiTraining.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error(`Failed to fetch training data with id ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create new training data
   * @param data The training data to create
   * @returns Promise containing the created training data
   */
  createTrainingData: async (data: TrainingData) => {
    try {
      return await db.aiTraining.create({
        data
      });
    } catch (error) {
      console.error("Failed to create training data:", error);
      throw error;
    }
  },
  
  /**
   * Update training data
   * @param id The unique identifier of the training data to update
   * @param data The updated training data
   * @returns Promise containing the updated training data
   */
  updateTrainingData: async (id: string, data: Partial<TrainingData>) => {
    try {
      return await db.aiTraining.update({
        where: { id },
        data
      });
    } catch (error) {
      console.error(`Failed to update training data with id ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete training data
   * @param id The unique identifier of the training data to delete
   * @returns Promise containing the deleted training data
   */
  deleteTrainingData: async (id: string) => {
    try {
      return await db.aiTraining.delete({
        where: { id }
      });
    } catch (error) {
      console.error(`Failed to delete training data with id ${id}:`, error);
      throw error;
    }
  }
}; 