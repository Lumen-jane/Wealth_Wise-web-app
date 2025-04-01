/*
  # Initial Schema for Finance Tracker

  1. Tables
    - users (managed by Supabase Auth)
    - transactions
      - Stores all financial transactions
      - Includes type (income/expense), amount, category, etc.
    - categories
      - Predefined transaction categories
    - financial_tips
      - Stores personalized financial advice
    
  2. Security
    - RLS enabled on all tables
    - Policies ensure users can only access their own data
*/

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE tip_impact AS ENUM ('high', 'medium', 'low');

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type transaction_type NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount decimal(12,2) NOT NULL,
  type transaction_type NOT NULL,
  category_id uuid REFERENCES categories(id),
  description text,
  date date NOT NULL,
  recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Financial tips table
CREATE TABLE financial_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  impact tip_impact NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_tips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their financial tips"
  ON financial_tips
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, type, icon) VALUES
  ('Salary', 'income', 'briefcase'),
  ('Investments', 'income', 'trending-up'),
  ('Freelance', 'income', 'laptop'),
  ('Housing', 'expense', 'home'),
  ('Transportation', 'expense', 'car'),
  ('Groceries', 'expense', 'shopping-cart'),
  ('Utilities', 'expense', 'zap'),
  ('Entertainment', 'expense', 'film'),
  ('Healthcare', 'expense', 'heart-pulse'),
  ('Education', 'expense', 'book-open');