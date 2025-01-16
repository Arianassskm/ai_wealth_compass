export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoalsDB {
  financialGoals: FinancialGoal[];
} 