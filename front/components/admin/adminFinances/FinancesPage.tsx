"use client";
import { useState } from "react";
import { HiCurrencyDollar, HiDocumentText, HiCollection } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

import PendingPayoutsSummary from "./PendingPayoutsSummary";
import SalesHistory from "./SalesHistory";
import PayoutBatchManagement from "./PayoutBatchManagement";
import PaidManagement from "./PaidManagement";

export default function FinancesSection() {
  const [activeTab, setActiveTab] = useState<
    "pending" | "sales" | "batches" | "batches-paid"
  >("pending");

  const [pendingCount, setPendingCount] = useState(0);
  const [batchesCount, setBatchesCount] = useState(0);
  const [paidBatchesCount, setPaidBatchesCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-font-light">Finanzas</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "pending"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiCurrencyDollar className="w-4 h-4" />
              Lotes pendientes
              {pendingCount > 0 && (
                <span className="text-amber-200/80 text-xs font-bold">
                  ({pendingCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("batches")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "batches"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiCollection className="w-4 h-4" />
              Cursos a pagar
              {batchesCount > 0 && (
                <span className="text-amber-200/80 text-xs font-bold ">
                  ({batchesCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("batches-paid")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "batches-paid"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <FaCheckCircle className="w-4 h-4" />
              Cursos pagados
              {paidBatchesCount > 0 && (
                <span className=" text-amber-200/80 text-xs font-bold ">
                  ({paidBatchesCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`pb-3 px-4 font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "sales"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiDocumentText className="w-4 h-4" />
              Historial de Ventas
            </button>
          </div>

          {/* Content */}
          <div>
            {activeTab === "pending" && (
              <PendingPayoutsSummary onCountChange={setPendingCount} />
            )}
            {activeTab === "batches" && (
              <PayoutBatchManagement onCountChange={setBatchesCount} />
            )}
            {activeTab === "batches-paid" && (
              <PaidManagement onCountChange={setPaidBatchesCount} />
            )}
            {activeTab === "sales" && <SalesHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}
