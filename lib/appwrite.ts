import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';
import type { Habit, HabitFormData } from './types';

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM || "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
  habitsTableId: process.env.EXPO_PUBLIC_APPWRITE_HABITS_TABLE_ID || "",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)  
  .setProject(config.projectId) 
  .setPlatform(config.platform);  

const account = new Account(client);
const databases = new Databases(client);

// Create a new habit
export async function createHabit(
  userId: string, 
  habitData: HabitFormData
): Promise<Habit> {
  try {
    const document = await databases.createDocument(
      config.databaseId,
      config.habitsTableId,
      ID.unique(),
      {
        name: habitData.name,
        category: habitData.category,
        frequency: habitData.frequency,
        icon: habitData.icon,
        userId: userId,
        completed: false,
      }
    );
    return document as unknown as Habit;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
}

// Get all habits for a user
export async function getHabits(userId: string): Promise<Habit[]> {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.habitsTableId,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as unknown as Habit[];
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
}

// Update habit completion status
export async function updateHabit(
  habitId: string, 
  completed: boolean
): Promise<Habit> {
  try {
    const document = await databases.updateDocument(
      config.databaseId,
      config.habitsTableId,
      habitId,
      { completed }
    );
    return document as unknown as Habit;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
}

export { account, databases, ID };
