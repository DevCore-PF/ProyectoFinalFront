import { PaymentTransaction, PaymentFilter, PurchaseHistoryStats } from '@/types/purchase-history.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const purchaseHistoryService = {
  // Obtener historial de pagos del usuario autenticado
  async getMyPaymentHistory(token: string): Promise<PaymentTransaction[]> {
    try {
      // Fetching payment history
      
      const response = await fetch(`${API_URL}/payments/my-payments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Response received

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error obteniendo historial de pagos:', errorData);
        
        let errorMessage = 'Error al obtener historial de pagos';
        
        switch (response.status) {
          case 401:
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            break;
          case 404:
            errorMessage = 'No se encontraron transacciones.';
            break;
          default:
            errorMessage = errorData.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      // Payment history fetched successfully
      return result;
    } catch (error) {
      console.error('💥 Error getMyPaymentHistory:', error);
      throw error;
    }
  },

  // Calcular estadísticas de las transacciones
  calculateStats(transactions: PaymentTransaction[]): PurchaseHistoryStats {
    if (transactions.length === 0) {
      return {
        totalSpent: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        mostExpensiveTransaction: 0,
        cardBrandsCount: {},
      };
    }

    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const mostExpensiveTransaction = Math.max(...transactions.map(t => t.amount));
    const averageTransaction = totalSpent / transactions.length;
    
    const cardBrandsCount = transactions.reduce((acc, transaction) => {
      const brand = transaction.cardBrand || 'unknown';
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = transactions
      .map(t => new Date(t.createdAt))
      .sort((a, b) => a.getTime() - b.getTime());
    
    return {
      totalSpent,
      totalTransactions: transactions.length,
      averageTransaction,
      mostExpensiveTransaction,
      firstTransactionDate: dates[0]?.toISOString(),
      lastTransactionDate: dates[dates.length - 1]?.toISOString(),
      cardBrandsCount,
    };
  },

  // Filtrar transacciones según criterios
  filterTransactions(transactions: PaymentTransaction[], filters: PaymentFilter): PaymentTransaction[] {
    let filtered = [...transactions];

    // Filtro por status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Filtro por rango de fechas
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let dateThreshold: Date;

      switch (filters.dateRange) {
        case '30days':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3months':
          dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '6months':
          dateThreshold = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          dateThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = new Date(0);
      }

      filtered = filtered.filter(t => new Date(t.createdAt) >= dateThreshold);
    }

    // Filtro por marca de tarjeta
    if (filters.cardBrand && filters.cardBrand !== 'all') {
      filtered = filtered.filter(t => t.cardBrand === filters.cardBrand);
    }

    return filtered;
  },

  // Formatear marca de tarjeta para mostrar
  formatCardBrand(brand: string): string {
    const brandMap: Record<string, string> = {
      'visa': 'Visa',
      'mastercard': 'Mastercard',
      'amex': 'American Express',
      'discover': 'Discover',
      'diners': 'Diners Club',
      'jcb': 'JCB',
      'unknown': 'Desconocido'
    };
    return brandMap[brand?.toLowerCase()] || 'Desconocido';
  },

  // Formatear status de pago
  formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'succeeded': 'Exitoso',
      'pending': 'Pendiente',
      'failed': 'Fallido',
      'processing': 'Procesando',
      'requires_action': 'Requiere Acción'
    };
    return statusMap[status?.toLowerCase()] || 'Desconocido';
  }
};