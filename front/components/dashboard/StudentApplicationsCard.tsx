"use client";

import { HiAcademicCap, HiClock, HiCheckCircle, HiXCircle } from "react-icons/hi";

interface StudentApplicationsCardProps {
  title: string;
}

interface ProfessorApplication {
  id: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewDate?: string;
}

const StudentApplicationsCard = ({ title }: StudentApplicationsCardProps) => {
  // Por ahora datos simulados - en el futuro vendrían del backend
  const applications: ProfessorApplication[] = [
    // Ejemplo de cómo se verían las postulaciones cuando el usuario las haga
    // {
    //   id: 1,
    //   submittedDate: "2025-11-10",
    //   status: "pending", // pending, approved, rejected
    //   reviewDate: null
    // }
  ];

  return (
    <div className="bg-transparent backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-slate-200">
          {title}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Revisa el estado de tus postulaciones para convertirte en profesor
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center text-slate-400 py-16 bg-slate-900/30 rounded-xl border border-slate-700/20">
          <HiAcademicCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-slate-300 mb-2">
            No tienes postulaciones aún
          </p>
          <p className="text-sm mb-6">
            ¡Postúlate para convertirte en profesor y comparte tu conocimiento!
          </p>
          <button
            onClick={() => console.log("Abrir modal de postulación")}
            className="inline-flex items-center gap-2 bg-button hover:bg-button/80 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300"
          >
            <HiAcademicCap className="w-5 h-5" />
            Postularme como Profesor
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => {
            const statusConfig = {
              pending: {
                icon: HiClock,
                color: "text-yellow-400",
                bg: "bg-yellow-500/20",
                text: "En revisión"
              },
              approved: {
                icon: HiCheckCircle,
                color: "text-green-400", 
                bg: "bg-green-500/20",
                text: "Aprobada"
              },
              rejected: {
                icon: HiXCircle,
                color: "text-red-400",
                bg: "bg-red-500/20", 
                text: "Rechazada"
              }
            };

            const config = statusConfig[application.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={application.id}
                className="space-y-3 p-4 rounded-xl bg-slate-900/30 border border-slate-500/50"
              >
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg font-semibold text-slate-200">
                    Postulación para Profesor
                  </span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-sm font-medium ${config.color}`}>
                      {config.text}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>Fecha de postulación: {new Date(application.submittedDate).toLocaleDateString('es-ES')}</p>
                  {application.reviewDate && (
                    <p>Fecha de revisión: {new Date(application.reviewDate).toLocaleDateString('es-ES')}</p>
                  )}
                </div>

                {application.status === 'approved' && (
                  <div className="mt-3">
                    <button
                      onClick={() => console.log("Ir a dashboard de profesor")}
                      className="text-sm text-button hover:text-button/80 font-medium transition-colors"
                    >
                      Ir a Dashboard de Profesor →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentApplicationsCard;