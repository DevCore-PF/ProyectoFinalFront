"use client";
import { useState } from "react";
import {
  HiCurrencyDollar,
  HiChartBar,
  HiUserCircle,
  HiCalendar,
  HiBookOpen,
  HiShieldCheck,
  HiEye,
} from "react-icons/hi";
import { TabType } from "@/types/admin.types";
import Loader from "@/components/Loaders/Loader";
import ChartFinances from "./Chart";
import DonutChart from "./DonutChart";
import { HiCash } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi";
import { GoMortarBoard } from "react-icons/go";

interface FinancesDetailProps {
  onViewDetail: (tab: TabType, id: string) => void;
}

const FinancesPage = ({ onViewDetail }: FinancesDetailProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"payments" | "memberships">(
    "payments"
  );
  const [timePeriod, setTimePeriod] = useState<"month" | "year">("year"); // Estado para el período

  // Datos de ejemplo
  const payments = [
    {
      id: "1",
      user: "Juan Pérez",
      amount: 100,
      date: "2025-11-10",
      type: "Curso",
      courseTitle: "Diseño UX",
      role: "alumno",
    },
    {
      id: "2",
      user: "Ana López",
      amount: 50,
      date: "2025-11-08",
      type: "Membresía",
      membershipType: "Mensual",
      role: "profesor",
    },
    {
      id: "3",
      user: "Carlos Ruiz",
      amount: 200,
      date: "2025-11-05",
      type: "Curso",
      courseTitle: "Desarrollo Full Stack",
      role: "profesor",
    },
  ];

  const memberships = [
    {
      id: "1",
      user: "Carlos Ruiz",
      amount: 30,
      date: "2025-11-05",
      plan: "Mensual",
      role: "alumno",
    },
    {
      id: "2",
      user: "Lucía Gómez",
      amount: 120,
      date: "2025-10-01",
      plan: "Anual",
      role: "profesor",
    },
  ];

  // Estadísticas
  const stats = {
    totalPayments: payments.length,
    totalMemberships: memberships.length,
    totalRevenue:
      payments.reduce((sum, p) => sum + p.amount, 0) +
      memberships.reduce((sum, m) => sum + m.amount, 0),
    totalStudents: [
      ...new Set(
        payments.filter((p) => p.role === "alumno").map((p) => p.user)
      ),
    ].length,
    totalTeachers: [
      ...new Set(
        payments.filter((p) => p.role === "profesor").map((p) => p.user)
      ),
    ].length,
  };

  // Datos para el gráfico por año (meses)
  const yearlyData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    data: [100, 200, 150, 300, 250, 400, 350, 280, 420, 380, 500, 450],
  };

  // Datos para el gráfico por mes (días del mes actual)
  const monthlyData = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    data: [
      50, 30, 80, 60, 100, 40, 90, 70, 120, 85, 95, 110, 75, 130, 60, 140, 90,
      100, 80, 150, 70, 120, 95, 110, 130, 85, 160, 100, 140, 180,
    ],
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-font-light">
                Finanzas
              </h1>
            </div>
           
          </div>
          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <HiDocumentText className="w-4 h-4 text-blue-300" />
                </div>
                <p className="text-slate-400 text-xs">Cursos</p>
              </div>
              <p className="text-2xl font-bold text-font-light">
                {stats.totalPayments}
              </p>
            </div>

            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <HiCash className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-slate-400 text-xs">Membresías</p>
              </div>
              <p className="text-2xl font-bold text-font-light">
                {stats.totalMemberships}
              </p>
            </div>

            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <HiCurrencyDollar className="w-4 h-4 text-emerald-300" />
                </div>
                <p className="text-slate-400 text-xs">Ingresos totales</p>
              </div>
              <p className="text-2xl font-bold text-emerald-300">
                ${stats.totalRevenue}
              </p>
            </div>

            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <HiBookOpen className="w-4 h-4 text-blue-300" />
                </div>
                <p className="text-slate-400 text-xs">Alumnos</p>
              </div>
              <p className="text-2xl font-bold text-blue-300">
                {stats.totalStudents}
              </p>
            </div>

            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <GoMortarBoard className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-slate-400 text-xs">Profesores</p>
              </div>
              <p className="text-2xl font-bold text-purple-300">
                {stats.totalTeachers}
              </p>
            </div>
          </div>
          {/* Grid de gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Gráfico de barras/líneas */}
            <div className="lg:col-span-2 bg-background2/40 border border-slate-700/50 rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-font-light flex items-center gap-2">
                  <HiChartBar className="w-5 h-5 text-purple-300" />
                  {timePeriod === "month"
                    ? "Ingresos por día"
                    : "Ingresos mensuales"}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimePeriod("month")}
                    className={`px-3 py-1.5 border rounded-lg cursor-pointer  text-xs font-medium transition-all ${
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
              <div className="flex-1 min-h-0 py-4">
                <ChartFinances
                  labels={
                    timePeriod === "month"
                      ? monthlyData.labels
                      : yearlyData.labels
                  }
                  data={
                    timePeriod === "month" ? monthlyData.data : yearlyData.data
                  }
                  period={timePeriod}
                />
              </div>
            </div>

            {/* Gráfico de donut */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-font-light flex items-center gap-2 mb-6">
                <HiShieldCheck className="w-5 h-5 text-emerald-300" />
                Distribución de ventas
              </h3>
              <div className="h-72">
                <DonutChart courses={45} careers={28} memberships={35} />
              </div>

              {/* Stats debajo del donut */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-300 text-sm">Cursos</span>
                  </div>
                  <span className="text-font-light font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-slate-300 text-sm">Carreras</span>
                  </div>
                  <span className="text-font-light font-semibold">28</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-300 text-sm">Membresías</span>
                  </div>
                  <span className="text-font-light font-semibold">35</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab("payments")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "payments"
                  ? "text-button/80 border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Cursos ({stats.totalPayments})
            </button>
            <button
              onClick={() => setActiveTab("memberships")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "memberships"
                  ? "text-button/80 border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Membresías ({stats.totalMemberships})
            </button>
          </div>
          {/* Tabla */}
          <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                      Monto
                    </th>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-right text-slate-400 text-sm font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {(activeTab === "payments" ? payments : memberships).map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                              <HiUserCircle className="w-5 h-5 text-purple-300" />
                            </div>
                            <span className="text-font-light font-medium">
                              {item.user}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-sm">
                            {item.type || item.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-300 font-semibold">
                            ${item.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <HiCalendar className="w-4 h-4 text-slate-400" />
                            {formatDate(item.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                              item.role === "alumno"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                            }`}
                          >
                            {item.role === "alumno" ? "Alumno" : "Profesor"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onViewDetail("finances", item.id)}
                              className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                              title="Ver detalle"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {(activeTab === "payments" ? payments : memberships).length ===
              0 && (
              <div className="text-center py-16">
                <HiCurrencyDollar className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400 text-lg font-medium mb-2">
                  No hay {activeTab === "payments" ? "pagos" : "membresías"}{" "}
                  registrados
                </p>
                <p className="text-slate-500 text-sm">
                  Los datos aparecerán aquí una vez que se realicen
                  transacciones
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-300 text-sm font-medium">
                Producto más vendido
              </h4>
            </div>
            <p className="text-2xl font-bold text-font-light mb-1">Diseño UX</p>
            <p className="text-blue-300 text-sm">156 ventas este mes</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-300 text-sm font-medium">
                Ingreso promedio
              </h4>
            </div>
            <p className="text-2xl font-bold text-font-light mb-1">$125.50</p>
            <p className="text-purple-300 text-sm">+12% vs mes anterior</p>
          </div>
        </div>
      </div>
      {/* <DonutChart/> */}
    </div>
  );
};

export default FinancesPage;
