import { useState, useEffect, useMemo } from 'react';
import { PaymentTransaction, PaymentFilter, PurchaseHistoryStats } from '@/types/purchase-history.types';
import { purchaseHistoryService } from '@/services/purchase-history.service';
import { useAuth } from '@/context/UserContext';

export const usePurchaseHistory = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilter>({
    status: 'all',
    dateRange: 'all',
    cardBrand: 'all'
  });

  // Filtrar transacciones basado en filtros actuales
  const filteredTransactions = useMemo(() => {
    return purchaseHistoryService.filterTransactions(transactions, filters);
  }, [transactions, filters]);

  // Calcular estadísticas de transacciones filtradas
  const stats = useMemo((): PurchaseHistoryStats => {
    return purchaseHistoryService.calculateStats(filteredTransactions);
  }, [filteredTransactions]);

  // Cargar historial de transacciones
  const loadPaymentHistory = async () => {
    if (!token) {
      setError('Usuario no autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Cargando historial de pagos...');
      const data = await purchaseHistoryService.getMyPaymentHistory(token);
      setTransactions(data);
      console.log('✅ Historial de pagos cargado:', data.length, 'transacciones');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error cargando historial:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar filtros
  const applyFilters = (newFilters: Partial<PaymentFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      cardBrand: 'all'
    });
  };

  // Recargar datos
  const refresh = () => {
    loadPaymentHistory();
  };

  // Cargar datos al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (token) {
      loadPaymentHistory();
    }
  }, [token]);

  return {
    // Datos
    transactions: filteredTransactions,
    allTransactions: transactions,
    stats,
    
    // Estado
    isLoading,
    error,
    filters,
    
    // Acciones
    loadPaymentHistory,
    applyFilters,
    clearFilters,
    refresh,
    
    // Utilidades
    formatCardBrand: purchaseHistoryService.formatCardBrand,
    formatPaymentStatus: purchaseHistoryService.formatPaymentStatus,
    
    // Información de filtros
    hasActiveFilters: filters.status !== 'all' || filters.dateRange !== 'all' || filters.cardBrand !== 'all',
    totalTransactionsCount: transactions.length,
    filteredTransactionsCount: filteredTransactions.length,
  };
};