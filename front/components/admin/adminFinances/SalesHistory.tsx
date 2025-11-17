"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  getAllSalesService,
  getAllSalesPendingService,
  getAllSalesPaidService,
} from "@/services/admin.service";
import {
  HiUserCircle,
  HiCalendar,
  HiDocumentText,
  HiCheckCircle,
  HiClock,
  HiChartBar,
} from "react-icons/hi";

import Loader from "@/components/Loaders/Loader";
import { toastError } from "@/helpers/alerts.helper";
import Chart from "./Chart";

interface Sale {
  saleID: string;
  saleDate: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  professorName: string;
  totalPrice: string;
  professorEarnings: string;
  adminEarnings: string;
  paymentId: string;
  stripeID: string;
  payoutStatus: string;
}

type SalesFilter = "ALL" | "PENDING" | "PAID";

export default function SalesHistory() {
  const { token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SalesFilter>("ALL");
  const [timePeriod, setTimePeriod] = useState<"month" | "year">("year");

  useEffect(() => {
    fetchSales(filter);
  }, [filter]);

  const fetchSales = async (filterType: SalesFilter) => {
    try {
      setLoading(true);
      let data;
      switch (filterType) {
        case "PENDING":
          if (token) {
            data = await getAllSalesPendingService(token);
            break;
          }
        case "PAID":
          if (token) {
            data = await getAllSalesPaidService(token);
            break;
          }
        default:
          if (token) {
            data = await getAllSalesService(token);
          }
      }
      setSales(data);
    } catch (error) {
      toastError("Error al cargar las ventas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calcular estadísticas
  const stats = {
    totalSales: sales.length,
    totalRevenue: sales.reduce((acc, s) => acc + parseFloat(s.totalPrice), 0),
    professorEarnings: sales.reduce(
      (acc, s) => acc + parseFloat(s.professorEarnings),
      0
    ),
    adminEarnings: sales.reduce(
      (acc, s) => acc + parseFloat(s.adminEarnings),
      0
    ),
  };
  // Preparar datos para el gráfico
  const getChartData = () => {
    if (timePeriod === "year") {
      // Agrupar por mes
      const monthlyData = sales.reduce((acc, sale) => {
        const month = new Date(sale.saleDate).toLocaleDateString("es-ES", {
          month: "short",
        });
        if (!acc[month]) {
          acc[month] = {
            name: month.charAt(0).toUpperCase() + month.slice(1),
            totalIngresos: 0,
            gananciaProfesores: 0,
            comisionAdmin: 0,
          };
        }
        acc[month].totalIngresos += parseFloat(sale.totalPrice);
        acc[month].gananciaProfesores += parseFloat(sale.professorEarnings);
        acc[month].comisionAdmin += parseFloat(sale.adminEarnings);
        return acc;
      }, {} as Record<string, any>);

      // Ordenar por meses del año
      const months = [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ];
      return months.map(
        (month) =>
          monthlyData[month] || {
            name: month,
            totalIngresos: 0,
            gananciaProfesores: 0,
            comisionAdmin: 0,
          }
      );
    } else {
      // Agrupar por día del mes actual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const dailyData = sales
        .filter((sale) => {
          const saleDate = new Date(sale.saleDate);
          return (
            saleDate.getMonth() === currentMonth &&
            saleDate.getFullYear() === currentYear
          );
        })
        .reduce((acc, sale) => {
          const day = new Date(sale.saleDate).getDate();
          if (!acc[day]) {
            acc[day] = {
              name: `${day}`,
              totalIngresos: 0,
              gananciaProfesores: 0,
              comisionAdmin: 0,
            };
          }
          acc[day].totalIngresos += parseFloat(sale.totalPrice);
          acc[day].gananciaProfesores += parseFloat(sale.professorEarnings);
          acc[day].comisionAdmin += parseFloat(sale.adminEarnings);
          return acc;
        }, {} as Record<number, any>);

      // Crear array con todos los días del mes
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return (
          dailyData[day] || {
            name: `${day}`,
            totalIngresos: 0,
            gananciaProfesores: 0,
            comisionAdmin: 0,
          }
        );
      });
    }
  };

  const chartData = getChartData();
  return (
    <div>
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <HiDocumentText className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-slate-400 text-xs">Total Ventas</p>
          </div>
          <p className="text-2xl font-bold text-font-light">
            {stats.totalSales}
          </p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <HiCheckCircle className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-slate-400 text-xs">Ingresos Totales</p>
          </div>
          <p className="text-2xl font-bold text-emerald-300">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <HiUserCircle className="w-4 h-4 text-purple-300" />
            </div>
            <p className="text-slate-400 text-xs">Ganancias Profesores</p>
          </div>
          <p className="text-2xl font-bold text-purple-300">
            ${stats.professorEarnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <HiClock className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-slate-400 text-xs">Comisión Admin (30%)</p>
          </div>
          <p className="text-2xl font-bold text-amber-200">
            ${stats.adminEarnings.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Gráfico de barras */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-font-light flex items-center gap-2">
            <HiChartBar className="w-5 h-5 text-purple-300" />
            {timePeriod === "month" ? "Ingresos por día" : "Ingresos mensuales"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimePeriod("month")}
              className={`px-3 py-1.5 border rounded-lg cursor-pointer text-xs font-medium transition-all ${
                timePeriod === "month"
                  ? "bg-button/80 border-button text-font-light"
                  : "bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-300"
              }`}
            >
              Este mes
            </button>
            <button
              onClick={() => setTimePeriod("year")}
              className={`px-3 py-1.5 border rounded-lg cursor-pointer text-xs font-medium transition-all ${
                timePeriod === "year"
                  ? "bg-button/80 border-button text-font-light"
                  : "bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-300"
              }`}
            >
              Este año
            </button>
          </div>
        </div>
        <div className="h-80">
          <Chart data={chartData} period={timePeriod} />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
              filter === "ALL"
                ? "bg-button/50 text-font-light border border-button"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${
              filter === "PENDING"
                ? "bg-amber-700/50 text-font-light border border-amber-500"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("PAID")}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
              filter === "PAID"
                ? "bg-emerald-700/50 text-font-light border border-emerald-500"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
            }`}
          >
            Pagadas
          </button>
        </div>

        <div className="text-sm text-slate-400">
          {sales.length} {sales.length === 1 ? "venta" : "ventas"}
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : sales.length === 0 ? (
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-16 text-center">
          <HiDocumentText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">
            No hay ventas para mostrar
          </p>
          <p className="text-slate-500 text-sm">
            Cambia los filtros o espera a que se realicen nuevas ventas
          </p>
        </div>
      ) : (
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Curso
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Estudiante
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Profesor
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Precio Total
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Ganancia Profesor
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Comisión Admin
                  </th>
                  <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {sales.map((sale) => (
                  <tr
                    key={sale.saleID}
                    className="transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <HiCalendar className="w-4 h-4 text-slate-400" />
                        {formatDate(sale.saleDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-font-light font-medium text-sm max-w-xs truncate">
                        {sale.courseTitle}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                          <HiUserCircle className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-font-light text-sm font-medium">
                            {sale.studentName}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {sale.studentEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-sm">
                        {sale.professorName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-font-light font-semibold">
                        ${parseFloat(sale.totalPrice).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-purple-300 font-semibold">
                        ${parseFloat(sale.professorEarnings).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-emerald-300 font-semibold">
                        ${parseFloat(sale.adminEarnings).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 ${
                          sale.payoutStatus === "Pagado"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        }`}
                      >
                        {sale.payoutStatus === "Pagado" ? (
                          <HiCheckCircle className="w-3 h-3" />
                        ) : (
                          <HiClock className="w-3 h-3" />
                        )}
                        {sale.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
