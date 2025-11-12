import React from "react";
import {
  HiBookOpen,
  HiShieldCheck,
  HiCurrencyDollar,
  HiTrendingUp,
} from "react-icons/hi";
import UsersStatistics from "./UsersStatistics";
import CoursesStatistics from "./CoursesStatistics";

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* USERS */}
        <UsersStatistics />
        {/* COURSES */}
        <CoursesStatistics />

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <HiCurrencyDollar className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm mb-1">Ingresos Totales</h3>
          <p className="text-xl font-bold text-white">${`Ingresos totales`}</p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <HiShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm mb-1">
            Validaciones Pendientes
          </h3>
          <p className="text-xl font-bold text-white">
            {`validations/pending`}
            {/* aprovalStatus para perfil de profesores y status para cursos nuevos o editados (en revison) */}
          </p>
        </div>
      </div>

      {/* Gráfico de actividad reciente */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <HiTrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              action: "Nuevo usuario registrado",
              user: "Ana López",
              time: "Hace 5 minutos",
            },
            {
              action: "Curso publicado",
              user: "Carlos Ruiz",
              time: "Hace 15 minutos",
            },
            {
              action: "Nueva solicitud de validación",
              user: "María González",
              time: "Hace 1 hora",
            },
            {
              action: "Compra realizada",
              user: "Juan Pérez",
              time: "Hace 2 horas",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="bg-slate-800/30 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-slate-400 text-sm">{activity.user}</p>
              </div>
              <span className="text-slate-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
