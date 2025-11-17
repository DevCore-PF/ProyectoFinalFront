import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiPlus,
  HiLink,
  HiChartBar,
  HiCurrencyDollar,
  HiShoppingCart,
} from "react-icons/hi";
import AdditionalContentModal from "./AdditionalContentModal";

interface ManagementOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface TeacherManagementPanelProps {
  className?: string;
}

const TeacherManagementPanel: React.FC<TeacherManagementPanelProps> = ({
  className = "",
}) => {
  const router = useRouter();
  const [showAdditionalContentModal, setShowAdditionalContentModal] =
    useState(false);

  const managementOptions: ManagementOption[] = [
    {
      id: "create-course",
      title: "Crear nuevo curso",
      description: "Inicia el flujo de creación desde cero.",
      icon: <HiPlus className="text-xl" />,
      onClick: () => {
        console.log("Navegando a crear curso...");
        router.push("/teacher-dashboard/create-course");
      },
    },
    {
      id: "additional-content",
      title: "Agregar contenido adicional",
      description: "Añade URLs y recursos extras a tus lecciones existentes.",
      icon: <HiLink className="text-xl" />,
      onClick: () => setShowAdditionalContentModal(true),
    },
    {
      id: "statistics",
      title: "Ver mis estadísticas",
      description: "Accede a métricas de rendimiento de tus cursos.",
      icon: <HiChartBar className="text-xl" />,
      onClick: () => console.log("Ver estadísticas"),
    },
    {
      id: "income",
      title: "Consultar ingresos",
      description: "Mira el alcance e historial de pagos por curso.",
      icon: <HiCurrencyDollar className="text-xl" />,
      onClick: () => router.push('/teacher-dashboard/earnings')
    },
    {
      id: "purchase-history",
      title: "Historial de compras",
      description: "Revisa todas tus compras y transacciones realizadas.",
      icon: <HiShoppingCart className="text-xl" />,
      onClick: () => router.push("/purchase-history"),
    },
  ];

  return (
    <div
      className={`rounded-xl p-6 text-font-light font-body ${className}`}
      style={{ backgroundColor: "#3F4273" }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Image
          src="/icons/settingsIcon.svg"
          alt="Panel de Gestión"
          width={24}
          height={24}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(96%) sepia(16%) saturate(290%) hue-rotate(22deg) brightness(103%) contrast(96%)",
          }}
        />
        <h2 className="text-xl font-medium">PANEL DE GESTIÓN</h2>
      </div>
      <p className="text-sm text-gray-300 font-light mb-6">
        Breve descripción de sección panel de gestión
      </p>

      <div className="space-y-0">
        {managementOptions.map((option, index) => (
          <div key={option.id}>
            <button
              onClick={option.onClick}
              className="w-full p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer text-left flex items-start space-x-3"
            >
              <div className="text-font-light mt-1">{option.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-font-light text-sm mb-1">
                  {option.title}
                </h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
            {index < managementOptions.length - 1 && (
              <div className="h-px bg-gray-600 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Modal para Agregar Contenido Adicional */}
      {showAdditionalContentModal && (
        <AdditionalContentModal
          isOpen={showAdditionalContentModal}
          onClose={() => setShowAdditionalContentModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherManagementPanel;
