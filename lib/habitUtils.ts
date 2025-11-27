import type { Habit } from './types';

/**
 * Checks if a habit should be reset based on its frequency and last completion date
 */
export function shouldResetHabit(habit: Habit): boolean {
  // Don't reset if already not completed or no completion history
  if (!habit.completed || !habit.completedDates || habit.completedDates.length === 0) {
    return false;
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Get the latest completed date
  const sortedDates = [...habit.completedDates].sort().reverse();
  const latestDateStr = sortedDates[0];
  
  if (habit.frequency === 'daily') {
    // Reset if latest completion is not today
    return latestDateStr !== todayStr;
  } else if (habit.frequency === 'weekly') {
    // Reset if latest completion is from a previous week
    const latestDate = new Date(latestDateStr);
    const daysSince = Math.floor((today.getTime() - latestDate.getTime()) / (24 * 60 * 60 * 1000));
    return daysSince >= 7;
  } else if (habit.frequency === 'monthly') {
    // Reset if latest completion is from a previous month
    const latestDate = new Date(latestDateStr);
    const isDifferentMonth = latestDate.getMonth() !== today.getMonth();
    const isDifferentYear = latestDate.getFullYear() !== today.getFullYear();
    return isDifferentMonth || isDifferentYear;
  }
  
  return false;
}
