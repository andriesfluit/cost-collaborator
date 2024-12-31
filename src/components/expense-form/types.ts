export type SplitType = 'restaurant' | 'no-kids' | 'kids';
export type Payer = 'A' | 'S';

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  payer: Payer;
  split_type: SplitType;
  user_id?: string;
  created_at?: string;
  split_ratio_a?: number;
  split_ratio_s?: number;
};