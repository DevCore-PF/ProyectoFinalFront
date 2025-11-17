const API_URL = process.env.NEXT_PUBLIC_API_URL 

export interface Earning {
  saleId: string;
  saleDate: string;
  courseTitle: string;
  yourEarnings: number;
  status: string; // 'Pendiente' | 'En Proceso' | 'Pagado'
  paymentReference: string | null;
}

export interface EarningsStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalSales: number;
}

export const earningsService = {
  /**
   * Obtiene el historial de ganancias del profesor
   * @param token Token de autenticación
   * @param status Filtro de estado: 'ALL' | 'PENDING' | 'PAID'
   */
  async getMyEarnings(
    token: string,
    status: 'ALL' | 'PENDING' | 'PAID' = 'ALL'
  ): Promise<Earning[]> {
    try {
      const response = await fetch(
        `${API_URL}/profiles/my-earnings?status=${status}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Error al obtener las ganancias'
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener ganancias:', error);
      throw error;
    }
  },

  /**
   * Calcula estadísticas basadas en el historial de ganancias
   */
  calculateStats(earnings: Earning[]): EarningsStats {
    const stats: EarningsStats = {
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      totalSales: earnings.length,
    };

    earnings.forEach((earning) => {
      const amount = Number(earning.yourEarnings);
      stats.totalEarnings += amount;

      if (earning.status === 'Pagado') {
        stats.paidEarnings += amount;
      } else {
        stats.pendingEarnings += amount;
      }
    });

    return stats;
  },
};
