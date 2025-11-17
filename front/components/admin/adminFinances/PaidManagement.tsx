// components/admin/PaidBatchesManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import {
  HiCheckCircle,
  HiUserCircle,
  HiCalendar,
  HiCash,
  HiDocumentText,
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";
import { getAllPaidBatchesService } from "@/services/admin.service";

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
interface PaidManagementtProps {
  onCountChange: (count: number) => void;
}

export default function PaidManagement({
  onCountChange,
}: PaidManagementtProps) {
  const { token } = useAuth();
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchPaidBatches = async () => {
      try {
        if (token) {
          const data = await getAllPaidBatchesService(token);
          setBatches(data);
          onCountChange(data.length);
        }
      } catch (error) {
        console.error("Error fetching paid batches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaidBatches();
  }, [token]);

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
          No hay lotes pagados
        </p>
        <p className="text-slate-500 text-sm">
          Los lotes pagados aparecerán aquí una vez que los marques como pagados
        </p>
      </div>
    );
  }

  // Agrupar batches por profesor
  const groupedBatches = groupByProfessor(batches);

  return (
    <div>
      <h2 className="text-xl font-semibold text-font-light mb-6">
        Historial de Pagos Realizados
      </h2>

      <div className="space-y-8">
        {Object.entries(groupedBatches).map(
          ([professorName, professorBatches]) => {
            // Calcular totales por profesor
            const totalAmount = professorBatches.reduce(
              (sum, batch) => sum + parseFloat(batch.totalAmount),
              0
            );

            return (
              <div key={professorName} className="space-y-4">
                {/* Header del profesor */}
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                      <HiUserCircle className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-font-light">
                        {professorName}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {professorBatches.length}{" "}
                        {professorBatches.length === 1
                          ? "pago realizado"
                          : "pagos realizados"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Total pagado</p>
                    <p className="text-xl font-bold text-emerald-300">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Lista de lotes del profesor */}
                <div className="grid grid-cols-1 gap-4 pl-4">
                  {professorBatches.map((batch) => (
                    <div
                      key={batch.payoutId}
                      className="bg-background2/40 border border-emerald-700/30 rounded-xl p-6 hover:border-emerald-600/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        {/* Info del lote */}
                        <div className="flex-1">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs mb-1">
                                Monto Pagado
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
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs mb-1">
                                Fecha de Pago
                              </p>
                              <div className="flex items-center gap-1 text-emerald-300">
                                <HiCheckCircle className="w-4 h-4" />
                                <span className="text-sm">
                                  {batch.paidAt
                                    ? new Date(batch.paidAt).toLocaleDateString(
                                        "es-ES"
                                      )
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Estado y Referencia */}
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                              <HiCheckCircle className="w-3 h-3" />
                              Pagado
                            </span>
                            {batch.referenceNumber && (
                              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-lg">
                                <HiDocumentText className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300 text-xs font-medium">
                                  Ref: {batch.referenceNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
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
