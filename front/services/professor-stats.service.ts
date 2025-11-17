const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface TopCourseStats {
  courseId: string;
  courseTitle: string;
  totalEarnings: number;
  salesCount: number;
  growthPercentage: number;
  thumbnail?: string;
}

export const professorStatsService = {
  /**
   * Obtiene los cursos top del profesor basado en earnings
   */
  async getTopCourses(token: string): Promise<TopCourseStats[]> {
    try {
      // Obtener earnings del profesor
      const earningsResponse = await fetch(
        `${API_URL}/profiles/my-earnings?status=ALL`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!earningsResponse.ok) {
        throw new Error('Error al obtener earnings');
      }

      const earnings = await earningsResponse.json();

      // Agrupar por curso y calcular estadísticas
      const courseStats = new Map<string, {
        courseTitle: string;
        totalEarnings: number;
        salesCount: number;
        recentSales: number;
        oldSales: number;
      }>();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      earnings.forEach((earning: any) => {
        const existing = courseStats.get(earning.courseTitle) || {
          courseTitle: earning.courseTitle,
          totalEarnings: 0,
          salesCount: 0,
          recentSales: 0,
          oldSales: 0,
        };

        existing.totalEarnings += Number(earning.yourEarnings);
        existing.salesCount += 1;

        // Calcular ventas recientes vs antiguas para crecimiento
        const saleDate = new Date(earning.saleDate);
        if (saleDate >= thirtyDaysAgo) {
          existing.recentSales += 1;
        } else {
          existing.oldSales += 1;
        }

        courseStats.set(earning.courseTitle, existing);
      });

      // Convertir a array y calcular crecimiento
      const topCourses: TopCourseStats[] = Array.from(courseStats.values())
        .map((stats, index) => {
          // Calcular porcentaje de crecimiento
          let growthPercentage = 0;
          if (stats.oldSales > 0) {
            growthPercentage = ((stats.recentSales - stats.oldSales) / stats.oldSales) * 100;
          } else if (stats.recentSales > 0) {
            growthPercentage = 100; // Si solo hay ventas recientes, es 100% de crecimiento
          }

          return {
            courseId: `course-${index}`, // Idealmente deberías tener el ID real
            courseTitle: stats.courseTitle,
            totalEarnings: stats.totalEarnings,
            salesCount: stats.salesCount,
            growthPercentage: Math.round(growthPercentage),
          };
        })
        .sort((a, b) => b.totalEarnings - a.totalEarnings) // Ordenar por earnings
        .slice(0, 5); // Top 5

      return topCourses;
    } catch (error) {
      console.error('Error fetching top courses:', error);
      throw error;
    }
  },
};
