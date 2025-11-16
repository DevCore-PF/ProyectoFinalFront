import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartFinancesProps {
  labels: string[];
  data: number[];
  period: "month" | "year";
}

const ChartFinances = ({ labels, data, period }: ChartFinancesProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Ingresos ($)",
        data,
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#cbd5e1",
          font: {
            size: 13,
            weight: "500" as const,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(139, 92, 246, 0.5)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `Ingresos: $${context.parsed.y}`;
          },
          title: function (context: any) {
            // Capturamos period desde el closure
            if (period === "month") {
              return `Día ${context[0].label}`;
            }
            return context[0].label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return "$" + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: period === "month" ? 10 : 12,
          },
          maxRotation: 0,
          autoSkip: period === "month",
          maxTicksLimit: period === "month" ? 15 : 12,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 10,
      },
    },
  };

  return <Bar data={chartData}  />;
};

export default ChartFinances;
