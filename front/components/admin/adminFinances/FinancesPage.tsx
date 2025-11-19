
"use client";
import { useState } from "react";
import { HiCurrencyDollar, HiDocumentText, HiCollection } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

import PendingPayoutsSummary from "./PendingPayoutsSummary";
import SalesHistory from "./SalesHistory";
import PayoutBatchManagement from "./PayoutBatchManagement";
import PaidManagement from "./PaidManagement";
import { useAdmin } from "@/context/AdminContext";

export default function FinancesSection() {
  const [activeTab, setActiveTab] = useState<"pending" | "sales" | "batches" | "batches-paid">("pending");

  const { pendingBatches, paidBatches, pendingSummary } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-font-light">Finanzas</h1>
            </div>
          </div>

          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-slate-700/50 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-2.5 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "pending"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiCurrencyDollar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Lotes pendientes</span>
              <span className="sm:hidden">Pendientes</span>
              {pendingSummary.length > 0 && (
                <span className="text-amber-200/80 text-xs font-bold">({pendingSummary.length})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("batches")}
              className={`pb-2.5 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "batches"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiCollection className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Lotes a pagar</span>
              <span className="sm:hidden">A pagar</span>
              {pendingBatches.length > 0 && (
                <span className="text-amber-200/80 text-xs font-bold">({pendingBatches.length})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("batches-paid")}
              className={`pb-2.5 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "batches-paid"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Lotes pagados</span>
              <span className="sm:hidden">Pagados</span>
              {paidBatches.length > 0 && (
                <span className="text-amber-200/80 text-xs font-bold">({paidBatches.length})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("sales")}
              className={`pb-2.5 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "sales"
                  ? "text-accent-medium border-b-2 border-button"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <HiDocumentText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden md:inline">Historial de Ventas</span>
              <span className="md:hidden">Ventas</span>
            </button>
          </div>

          <div>
            {activeTab === "pending" && <PendingPayoutsSummary />}
            {activeTab === "batches" && <PayoutBatchManagement />}
            {activeTab === "batches-paid" && <PaidManagement />}
            {activeTab === "sales" && <SalesHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}
