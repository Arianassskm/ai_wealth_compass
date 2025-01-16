import { join } from 'path';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { FinancialGoal, FinancialGoalsDB } from '../types/financial-goals';

const file = join(__dirname, 'financial-goals.json');
const adapter = new FileSync<FinancialGoalsDB>(file);
const db = lowdb(adapter);

export const FinancialGoalsModel = {
  getUserGoals: async (userId: string): Promise<FinancialGoal[]> => {
    return db.get('financialGoals').value().filter(goal => goal.userId === userId);
  },

  createGoal: async (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialGoal> => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.get('financialGoals')
      .push(newGoal)
      .write();
      
    return newGoal;
  },

  updateGoal: async (goalId: string, userId: string, updates: Partial<FinancialGoal>): Promise<FinancialGoal | null> => {
    const goal = db.get('financialGoals')
      .find({ id: goalId, userId })
      .value();

    if (!goal) return null;

    const updatedGoal = {
      ...goal,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.get('financialGoals')
      .find({ id: goalId })
      .assign(updatedGoal)
      .write();

    return updatedGoal;
  },

  deleteGoal: async (goalId: string, userId: string): Promise<boolean> => {
    const removed = db.get('financialGoals')
      .remove({ id: goalId, userId })
      .write();

    return removed.length > 0;
  }
}; 
