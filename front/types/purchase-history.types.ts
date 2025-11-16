export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  cardBrand: string;
  cardLast4: string;
  createdAt: string;
  courses: TransactionCourse[];
}

export interface TransactionCourse {
  id: string;
  title: string;
  price: number;
}

export interface PurchaseHistoryStats {
  totalSpent: number;
  totalTransactions: number;
  averageTransaction: number;
  mostExpensiveTransaction: number;
  firstTransactionDate?: string;
  lastTransactionDate?: string;
  cardBrandsCount: Record<string, number>;
}

export interface PaymentFilter {
  status?: 'all' | 'succeeded' | 'pending' | 'failed';
  dateRange?: 'all' | '30days' | '3months' | '6months' | '1year';
  cardBrand?: 'all' | 'visa' | 'mastercard' | 'amex';
}

export interface PurchaseHistoryResponse {
  transactions: PaymentTransaction[];
  stats: PurchaseHistoryStats;
}