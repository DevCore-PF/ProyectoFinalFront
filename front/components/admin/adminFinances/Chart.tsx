// components/admin/FinancesChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FinancesChartProps {
  data: {
    name: string;
    totalIngresos: number;
    gananciaProfesores: number;
    comisionAdmin: number;
  }[];
  period: "month" | "year";
}

export default function Chart({ data, period }: FinancesChartProps) {
  // ============[ CUSTOM TOOLTIP ]============
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background2 border border-slate-700/50 rounded-lg p-2 sm:p-3 shadow-xl">
          <p className="text-font-light font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-2 sm:gap-4 mb-1">
              <span className="text-xs" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-xs sm:text-sm font-bold text-font-light">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ 
          top: 20, 
          right: 10, 
          left: 0, 
          bottom: 5 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
        <XAxis
          dataKey="name"
          stroke="#94a3b8"
          style={{
            fontSize: "10px",
            fontFamily: "inherit",
          }}
          tick={{ fontSize: 10 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#94a3b8"
          style={{
            fontSize: "10px",
            fontFamily: "inherit",
          }}
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `$${value}`}
          width={50}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} 
        />
        <Legend
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "10px",
          }}
          iconType="circle"
          iconSize={8}
        />
        <Bar 
          dataKey="totalIngresos" 
          name="Ingresos Totales" 
          fill="#61d6af" 
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
        <Bar
          dataKey="gananciaProfesores"
          name="Ganancia Profesores (70%)"
          fill="#c288f9"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
        <Bar 
          dataKey="comisionAdmin" 
          name="Comisión Admin (30%)" 
          fill="#689df1" 
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
