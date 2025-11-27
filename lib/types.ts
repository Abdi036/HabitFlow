export interface Habit {
  $id: string;
  name: string;
  category: string;
  frequency: string;
  icon: string;
  userId: string;
  completed: boolean;
  completedDates: string[];
  $createdAt: string;
  $updatedAt: string;
}

export interface HabitFormData {
  name: string;
  category: string;
  frequency: string;
  icon: string;
}
