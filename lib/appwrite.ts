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
        description: habitData.description || "",
        userId: userId,
        completed: false,
        completedDates: [],
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
    return [];
  }
}

// Update habit completion status and history
export async function updateHabit(
  habitId: string, 
  completed: boolean,
  currentCompletedDates: string[] = []
): Promise<Habit> {
  try {
    // Use local date instead of UTC to avoid timezone issues
    const today = new Date();
    const localDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let updatedDates = [...currentCompletedDates];

    if (completed) {
      // Add today if not present
      if (!updatedDates.includes(localDateStr)) {
        updatedDates.push(localDateStr);
      }
    } else {
      // Remove today
      updatedDates = updatedDates.filter(date => date !== localDateStr);
    }

    const document = await databases.updateDocument(
      config.databaseId,
      config.habitsTableId,
      habitId,
      { 
        completed,
        completedDates: updatedDates
      }
    );
    return document as unknown as Habit;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
}

// Update habit details (name, description)
export async function updateHabitDetails(
  habitId: string,
  updates: { name?: string; description?: string }
): Promise<Habit> {
  try {
    const document = await databases.updateDocument(
      config.databaseId,
      config.habitsTableId,
      habitId,
      updates
    );
    return document as unknown as Habit;
  } catch (error) {
    console.error('Error updating habit details:', error);
    throw error;
  }
}

// Delete a habit
export async function deleteHabit(habitId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      config.databaseId,
      config.habitsTableId,
      habitId
    );
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
}

export { account, databases, ID };
