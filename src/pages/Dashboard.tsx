import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface Transaction {
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

function Dashboard() {
  // We've removed the unused transactions state since it's not used in the component
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Convert fetchTransactions to useCallback to properly handle dependencies
  const fetchTransactions = useCallback(async () => {
    try {
      const endDate = endOfMonth(new Date());
      const startDate = startOfMonth(subMonths(endDate, 5)); // Last 6 months

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      processTransactionData(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed for fetchTransactions

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Added fetchTransactions as a dependency

  const processTransactionData = (transactions: Transaction[]) => {
    // Calculate totals
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );

    setTotalIncome(totals.income);
    setTotalExpenses(totals.expenses);

    // Process monthly data
    const monthlyDataMap = new Map<string, { income: number; expenses: number }>();

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'MMM yyyy');
      monthlyDataMap.set(monthKey, { income: 0, expenses: 0 });
    }

    // Aggregate transactions by month
    transactions.forEach((transaction) => {
      const monthKey = format(new Date(transaction.date), 'MMM yyyy');
      const monthData = monthlyDataMap.get(monthKey) || { income: 0, expenses: 0 };

      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expenses += transaction.amount;
      }

      monthlyDataMap.set(monthKey, monthData);
    });

    // Convert map to array and sort by date
    const monthlyDataArray = Array.from(monthlyDataMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
      }))
      .reverse();

    setMonthlyData(monthlyDataArray);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate month-over-month changes
  const previousMonthData = monthlyData[1] || { income: 0, expenses: 0 };
  const currentMonthData = monthlyData[0] || { income: 0, expenses: 0 };
  
  const incomeChange = calculatePercentageChange(
    currentMonthData.income,
    previousMonthData.income
  );
  
  const expensesChange = calculatePercentageChange(
    currentMonthData.expenses,
    previousMonthData.expenses
  );

  const netSavings = totalIncome - totalExpenses;
  const savingsChange = calculatePercentageChange(
    currentMonthData.income - currentMonthData.expenses,
    previousMonthData.income - previousMonthData.expenses
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          <p className={`text-sm ${incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% from last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          <p className={`text-sm ${expensesChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}% from last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Net Savings</h3>
          <p className="text-3xl font-bold text-blue-600">${netSavings.toFixed(2)}</p>
          <p className={`text-sm ${savingsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {savingsChange >= 0 ? '+' : ''}{savingsChange.toFixed(1)}% from last month
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                name="Income"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                name="Expenses"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;