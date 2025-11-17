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
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";
import {
  getAllSalesPendingService,
  markAsPaidService,
} from "@/services/admin.service";

interface PayoutBatch {
  id: string;
  professorName: string;
  totalAmount: number;
  salesCount: number;
  status: "PENDING" | "PAID";
  createdAt: string;
  paidAt?: string;
  referenceNumber?: string;
  sales:Sale[]
}

interface Sale {
  saleID: string;
  saleDate: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  professorName: string;
  totalPrice: string;
  professorEarnings: string;
  adminEarnings: string;
  paymentId: string;
  stripeID: string;
  payoutStatus: string;
}


export default function PayoutBatchManagement() {
  const { token } = useAuth();
  const [batches, setBatches] = useState<PayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsPaid, setMarkingAsPaid] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Crear este endpoint en el backend
    // fetchBatches();
    const fetchPendingBatches = async () => {
      try {
        if (token) {
          const data = getAllSalesPendingService(token);
          setPendingBatch(data);
        }
      } catch (error) {}
    };
    setLoading(false);
  }, []);

  const handleMarkAsPaid = async (batchId: string, professorName: string) => {
    if (!referenceNumber.trim()) {
      toastError("Debes ingresar un número de referencia");
      return;
    }

    if (!confirm(`¿Marcar como pagado el lote de ${professorName}?`)) return;

    try {
      setMarkingAsPaid(batchId);
      if (token) {
        await markAsPaidService(token, batchId, referenceNumber);
        toastSuccess("Lote marcado como pagado exitosamente");
        // fetchBatches(); // Recargar
        setSelectedBatch(null);
        setReferenceNumber("");
      }
    } catch (error) {
      toastError("Error al marcar como pagado");
      console.error(error);
    } finally {
      setMarkingAsPaid(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  // Mock data - reemplazar cuando tengas el endpoint
  const mockBatches: PayoutBatch[] = [];

  if (mockBatches.length === 0) {
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

  return (
    <div>
      <h2 className="text-xl font-semibold text-font-light mb-6">
        Gestión de Lotes de Pago
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {mockBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between">
              {/* Info del lote */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                    <HiUserCircle className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-font-light font-semibold text-lg">
                      {batch.professorName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {batch.salesCount}{" "}
                      {batch.salesCount === 1 ? "venta" : "ventas"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">Monto Total</p>
                    <p className="text-xl font-bold text-emerald-300">
                      ${batch.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-1">
                      Fecha de Creación
                    </p>
                    <div className="flex items-center gap-1 text-slate-300">
                      <HiCalendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(batch.createdAt).toLocaleDateString("es-ES")}
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
                  {batch.status === "PAID" && batch.referenceNumber && (
                    <span className="text-slate-400 text-xs">
                      Ref: {batch.referenceNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              {batch.status === "PENDING" && (
                <div className="ml-4">
                  {selectedBatch === batch.id ? (
                    <div className="bg-slate-800/50 rounded-lg p-4 min-w-[300px]">
                      <p className="text-slate-300 text-sm mb-2 font-medium">
                        Número de referencia
                      </p>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Ej: TRANS-2025-001"
                        className="w-full bg-background border border-slate-600 rounded-lg px-3 py-2 text-font-light text-sm mb-3 focus:outline-none focus:border-button"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleMarkAsPaid(batch.id, batch.professorName)
                          }
                          disabled={markingAsPaid === batch.id}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 rounded-lg transition disabled:opacity-50 text-sm"
                        >
                          {markingAsPaid === batch.id
                            ? "Procesando..."
                            : "Confirmar"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBatch(null);
                            setReferenceNumber("");
                          }}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedBatch(batch.id)}
                      className="bg-gradient-to-r from-button/80 to-button hover:from-button hover:to-button/90 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2"
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
