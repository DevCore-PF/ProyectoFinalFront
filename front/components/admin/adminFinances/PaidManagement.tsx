"use client";
import { useState } from "react";
import {
  HiCheckCircle,
  HiUserCircle,
  HiCalendar,
  HiCash,
  HiDocumentText,
  HiChevronDown,
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";
import { PayoutBatch } from "@/types/admin.types";
import { useAdmin } from "@/context/AdminContext";

export default function PaidManagement() {
  const { paidBatches, isLoadingPaidBatches } = useAdmin();
  const [expandedProfessors, setExpandedProfessors] = useState<Set<string>>(new Set());

  // ============[ GROUP BY PROFESSOR ]============
  const groupByProfessor = (batches: PayoutBatch[]) => {
    return batches.reduce((grouped, batch) => {
      const professorName = batch.professorName;
      if (!grouped[professorName]) {
        grouped[professorName] = [];
      }
      grouped[professorName].push(batch);
      return grouped;
    }, {} as Record<string, PayoutBatch[]>);
  };

  // ============[ TOGGLE EXPANSION ]============
  const toggleProfessor = (professorName: string) => {
    setExpandedProfessors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(professorName)) {
        newSet.delete(professorName);
      } else {
        newSet.add(professorName);
      }
      return newSet;
    });
  };

  // ============[ LOADING ]============
  if (isLoadingPaidBatches) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  // ============[ EMPTY STATE ]============
  if (paidBatches.length === 0) {
    return (
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-12 sm:p-16 text-center">
        <HiCash className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600 mb-4" />
        <p className="text-slate-400 text-base sm:text-lg font-medium mb-2">No hay lotes pagados</p>
        <p className="text-slate-500 text-sm">
          Los lotes pagados aparecerán aquí una vez que los marques como pagados
        </p>
      </div>
    );
  }

  const groupedBatches = groupByProfessor(paidBatches);

  return (
    <div>
      {/* ============[ TITLE ]============ */}
      <h2 className="text-lg sm:text-xl font-semibold text-font-light mb-4 sm:mb-6">
        Historial de Pagos Realizados
      </h2>

      <div className="space-y-6 sm:space-y-8">
        {Object.entries(groupedBatches).map(([professorName, professorBatches]) => {
          const isExpanded = expandedProfessors.has(professorName);
          const totalAmount = professorBatches.reduce((sum, batch) => sum + parseFloat(batch.totalAmount), 0);

          return (
            <div key={professorName} className="space-y-3 sm:space-y-4">
              {/* ============[ PROFESSOR HEADER ]============ */}
              <button
                onClick={() => toggleProfessor(professorName)}
                className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <HiUserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-font-light truncate">
                      {professorName}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {professorBatches.length}{" "}
                      {professorBatches.length === 1 ? "pago realizado" : "pagos realizados"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-slate-400 text-xs mb-1">Total pagado</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-300">${totalAmount.toFixed(2)}</p>
                  </div>
                  <HiChevronDown
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* ============[ BATCH LIST ]============ */}
              <div
                className={`grid grid-cols-1 gap-3 sm:gap-4 pl-0 sm:pl-4 transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {professorBatches.map((batch) => (
                  <div
                    key={batch.payoutId}
                    className="bg-background2/40 border border-emerald-700/30 rounded-xl p-4 sm:p-6 hover:border-emerald-600/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      {/* Batch Info */}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-xs mb-1">Monto Pagado</p>
                            <p className="text-lg sm:text-xl font-bold text-emerald-300">
                              ${parseFloat(batch.totalAmount).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-400 text-xs mb-1">Fecha de Creación</p>
                            <div className="flex items-center gap-1 text-slate-300">
                              <HiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">
                                {new Date(batch.createdAt).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                            <p className="text-slate-400 text-xs mb-1">Fecha de Pago</p>
                            <div className="flex items-center gap-1 text-emerald-300">
                              <HiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">
                                {batch.paidAt ? new Date(batch.paidAt).toLocaleDateString("es-ES") : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status and Reference */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <span className="px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border-emerald-500/20 w-fit">
                            <HiCheckCircle className="w-3 h-3" />
                            Pagado
                          </span>
                          {batch.referenceNumber && (
                            <div className="flex items-center gap-2 bg-slate-800/50 px-2 sm:px-3 py-1 rounded-lg w-fit">
                              <HiDocumentText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                              <span className="text-slate-300 text-xs font-medium break-all">
                                Ref: {batch.referenceNumber}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 bg-slate-800/50 px-2 sm:px-3 py-1 rounded-lg w-fit">
                            <span className="text-slate-300 text-xs font-medium">
                              Cursos pagados: {batch.salesCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
