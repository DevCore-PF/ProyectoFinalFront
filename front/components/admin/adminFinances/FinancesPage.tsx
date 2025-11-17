"use client";
import { useState } from "react";
import { HiCurrencyDollar, HiDocumentText, HiCollection } from "react-icons/hi";
import PendingPayoutsSummary from "./PendingPayoutsSummary";
import SalesHistory from "./SalesHistory";
import PayoutBatchManagement from "./PayoutBatchManagement";

export default function FinancesSection() {
  const [activeTab, setActiveTab] = useState<"pending" | "sales" | "batches">(
    "pending"
  );

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
              Pagos Pendientes
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
              Lotes a pagar
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
            {activeTab === "pending" && <PendingPayoutsSummary />}
            {activeTab === "sales" && <SalesHistory />}
            {activeTab === "batches" && <PayoutBatchManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
