// Crear componente DonutChart.tsx
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  courses: number;
  careers: number;
  memberships: number;
}

const DonutChart = ({ courses, careers, memberships }: DonutChartProps) => {
  const data = {
    labels: ["Cursos", "Carreras", "Membresías"],
    datasets: [
      {
        label: "Ventas por tipo",
        data: [courses, careers, memberships],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // blue
          "rgba(139, 92, 246, 0.8)", // purple
          "rgba(16, 185, 129, 0.8)", // green
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
     : true,
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
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(139, 92, 246, 0.5)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%", // Esto lo hace donut en vez de pie
  };

  return <Doughnut data={data}  />;
};

export default DonutChart;
