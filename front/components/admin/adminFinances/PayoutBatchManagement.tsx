// components/admin/PayoutBatchManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  HiCheckCircle,
  HiClock,
  HiUserCircle,
  HiCalendar,
  HiCash,
  HiChevronDown,
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";
import {
  getAllPendingBatchesService,
  markAsPaidService,
} from "@/services/admin.service";

interface PayoutBatch {
  payoutId: string;
  status: "PENDING" | "PAID";
  createdAt: string;
  paidAt: string | null;
  totalAmount: string;
  professorName: string;
  professorId: string;
  referenceNumber?: string;
}

interface PayoutBatchManagementProps {
  onCountChange: (count: number) => void;
}

export default function PayoutBatchManagement({
  onCountChange,
}: PayoutBatchManagementProps) {
  const { token } = useAuth();
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsPaid, setMarkingAsPaid] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [expandedProfessors, setExpandedProfessors] = useState<Set<string>>(
    new Set()
  );

  // Función para agrupar por profesor
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

  // Función para toggle el estado de expansión
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

  useEffect(() => {
    const fetchPendingBatches = async () => {
      try {
        if (token) {
          const data = await getAllPendingBatchesService(token);
          setBatches(data);
          onCountChange(data.length);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBatches();
  }, [token]);

  const handleMarkAsPaid = async (batchId: string, professorName: string) => {
    if (!referenceNumber.trim()) {
      toastError("Debes ingresar un número de referencia");
      return;
    }
    toastConfirm(
      `Marcar como pagado el curso de ${professorName}?`,
      async () => {
        try {
          setMarkingAsPaid(batchId);
          if (token) {
            await markAsPaidService(token, batchId, referenceNumber);
            toastSuccess("Lote marcado como pagado exitosamente");

            setBatches((prevBatches) =>
              prevBatches.map((batch) =>
                batch.payoutId === batchId
                  ? { ...batch, status: "PAID", referenceNumber }
                  : batch
              )
            );

            setSelectedBatch(null);
            setReferenceNumber("");
          }
        } catch (error) {
          toastError("Error al marcar como pagado");
          console.error(error);
        } finally {
          setMarkingAsPaid(null);
        }
      },
      () => {}
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-16 text-center">
        <HiCash className="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg font-medium mb-2">
          No hay lotes de pago creados
        </p>
        <p className="text-slate-500 text-sm">
          Los lotes aparecerán aquí una vez que los crees desde la sección de
          Pagos Pendientes
        </p>
      </div>
    );
  }

  // Agrupar batches por profesor
  const groupedBatches = groupByProfessor(batches);

  return (
    <div>
      <h2 className="text-xl font-semibold text-font-light mb-6">
        Gestión de Lotes de Pago
      </h2>

      <div className="space-y-8">
        {Object.entries(groupedBatches).map(
          ([professorName, professorBatches]) => {
            const isExpanded = expandedProfessors.has(professorName);
            const totalAmount = professorBatches.reduce(
              (sum, batch) => sum + parseFloat(batch.totalAmount),
              0
            );
            const pendingCount = professorBatches.filter(
              (b) => b.status === "PENDING"
            ).length;

            return (
              <div key={professorName} className="space-y-4">
                {/* Header del profesor - Clickeable */}
                <button
                  onClick={() => toggleProfessor(professorName)}
                  className="w-full flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                      <HiUserCircle className="w-6 h-6 text-purple-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-font-light">
                        {professorName}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {professorBatches.length}{" "}
                        {professorBatches.length === 1 ? "lote" : "lotes"}
                        {pendingCount > 0 && (
                          <span className="text-yellow-400 ml-2">
                            • {pendingCount} pendiente
                            {pendingCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-slate-400 text-xs mb-1">
                        Total acumulado
                      </p>
                      <p className="text-xl font-bold text-emerald-300">
                        ${totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <HiChevronDown
                      className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Lista de lotes del profesor - Colapsable */}
                <div
                  className={`grid grid-cols-1 gap-4 pl-4 transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "max-h-[5000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {professorBatches.map((batch) => (
                    <div
                      key={batch.payoutId}
                      className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        {/* Info del lote */}
                        <div className="flex-1">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs mb-1">
                                Monto
                              </p>
                              <p className="text-xl font-bold text-emerald-300">
                                ${parseFloat(batch.totalAmount).toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs mb-1">
                                Fecha de Creación
                              </p>
                              <div className="flex items-center gap-1 text-slate-300">
                                <HiCalendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {new Date(batch.createdAt).toLocaleDateString(
                                    "es-ES"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Estado */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 ${
                                batch.status === "PAID"
                                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                  : "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                              }`}
                            >
                              {batch.status === "PAID" ? (
                                <HiCheckCircle className="w-3 h-3" />
                              ) : (
                                <HiClock className="w-3 h-3" />
                              )}
                              {batch.status === "PAID" ? "Pagado" : "Pendiente"}
                            </span>
                            {batch.status === "PAID" &&
                              batch.referenceNumber && (
                                <span className="text-slate-400 text-xs">
                                  Ref: {batch.referenceNumber}
                                </span>
                              )}
                          </div>
                        </div>

                        {/* Acciones */}
                        {batch.status === "PENDING" && (
                          <div className="ml-4">
                            {selectedBatch === batch.payoutId ? (
                              <div className="bg-slate-800/50 rounded-lg p-4 min-w-[300px]">
                                <p className="text-slate-300 text-sm mb-2 font-medium">
                                  Número de referencia
                                </p>
                                <input
                                  type="text"
                                  value={referenceNumber}
                                  onChange={(e) =>
                                    setReferenceNumber(e.target.value)
                                  }
                                  placeholder="Ej: TRANS-2025-001"
                                  className="w-full bg-background border border-slate-600 rounded-lg px-3 py-2 text-font-light text-sm mb-3 focus:outline-none focus:border-button"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleMarkAsPaid(
                                        batch.payoutId,
                                        batch.professorName
                                      )
                                    }
                                    disabled={markingAsPaid === batch.payoutId}
                                    className="flex-1 bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-font-light font-medium py-2 px-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                  >
                                    {markingAsPaid === batch.payoutId
                                      ? "Procesando..."
                                      : "Confirmar"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedBatch(null);
                                      setReferenceNumber("");
                                    }}
                                    className="px-3 py-2 bg-slate-700 cursor-pointer hover:bg-slate-600 text-slate-300 rounded-lg transition text-sm"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedBatch(batch.payoutId)}
                                className="bg-gradient-to-r from-button/80 cursor-pointer to-button hover:from-button hover:to-button/90 text-font-light font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
                              >
                                <HiCheckCircle className="w-5 h-5" />
                                Marcar como Pagado
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
