export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  recurring: boolean;
  created_at: string;
}

export interface MonthlyAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  savingsRecommendation: number;
  investmentRecommendation: number;
  upcomingBills: Transaction[];
}

export interface FinancialTip {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
}