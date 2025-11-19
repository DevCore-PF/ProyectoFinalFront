"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import { createBatchService } from "@/services/admin.service";
import { HiCurrencyDollar, HiUserGroup, HiShoppingCart, HiCash } from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";
import { toastConfirm, toastError, toastSuccess } from "@/helpers/alerts.helper";
import { PendingSummary } from "@/types/admin.types";
import { useAdmin } from "@/context/AdminContext";


export default function PendingPayoutsSummary() {
  const { token } = useAuth();
  const [creatingBatch, setCreatingBatch] = useState<string | null>(null);
  const { pendingSummary, isLoadingPendingSummary, fetchPendingSummary, fetchPendingBatches } = useAdmin();

  const handleCreateBatch = async (professorId: string, professorName: string) => {
    toastConfirm(
      `Crear lote de pago para ${professorName}?`,
      async () => {
        try {
          setCreatingBatch(professorId);
          if (token) {
            await createBatchService(token, professorId);
            toastSuccess(`Lote creado exitosamente para ${professorName}`);
            await Promise.all([fetchPendingSummary(), fetchPendingBatches()]);
          }
          fetchPendingSummary();
        } catch (error) {
          toastError("Error al crear el lote de pago");
          console.error(error);
        } finally {
          setCreatingBatch(null);
        }
      },
      () => {}
    );
  };

  // ============[ LOADING ]============
  if (isLoadingPendingSummary) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  // ============[ EMPTY STATE ]============
  if (pendingSummary.length === 0) {
    return (
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-12 sm:p-16 text-center">
        <HiCurrencyDollar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600 mb-4" />
        <p className="text-slate-400 text-base sm:text-lg font-medium mb-2">No hay pagos pendientes</p>
        <p className="text-slate-500 text-sm">Todos los profesores están al día con sus pagos</p>
      </div>
    );
  }

  const totalOwed = pendingSummary.reduce((acc, p) => acc + p.totalOwed, 0);
  const totalSales = pendingSummary.reduce((acc, p) => acc + p.salesCount, 0);

  return (
    <div>
      {/* ============[ GLOBAL STATS ]============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-emerald-500/10 rounded-lg">
              <HiCurrencyDollar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Total a Pagar</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-300">${totalOwed.toFixed(2)}</p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600 transition-all">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
              <HiUserGroup className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Profesores</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-font-light">{pendingSummary.length}</p>
        </div>

        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600 transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
              <HiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Ventas Pendientes</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-font-light">{totalSales}</p>
        </div>
      </div>

      {/* ============[ TITLE ]============ */}
      <h2 className="text-lg sm:text-xl font-semibold text-font-light mb-3 sm:mb-4">
        Pagos pendientes por profesor
      </h2>

      {/* ============[ PROFESSOR CARDS ]============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {pendingSummary.map((professor) => (
          <div
            key={professor.professorId}
            className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600 transition-all"
          >
            {/* Professor Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30 shrink-0">
                    <span className="text-purple-300 font-bold text-sm">
                      {professor.professorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-font-light font-semibold text-sm sm:text-base truncate">
                      {professor.professorName}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      {professor.salesCount} {professor.salesCount === 1 ? "curso" : "cursos"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount to Pay */}
            <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-slate-400 text-xs mb-1">Monto a pagar</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-300">
                ${professor.totalOwed.toFixed(2)}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleCreateBatch(professor.professorId, professor.professorName)}
              disabled={creatingBatch === professor.professorId}
              className="w-full bg-gradient-to-r cursor-pointer from-button/80 to-button hover:from-button hover:to-button/90 text-font-light font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {creatingBatch === professor.professorId ? (
                <>
                  <svg className="animate-spin h-4 h-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="hidden sm:inline">Creando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <HiCash className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Crear Lote de Pago</span>
                  <span className="sm:hidden">Crear Lote</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
