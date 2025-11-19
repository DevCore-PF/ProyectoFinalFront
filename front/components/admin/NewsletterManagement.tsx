// components/admin/NewsletterManagement.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";
import {
  HiMail,
  HiClock,
  HiLightningBolt,
  HiCalendar,
  HiChevronDown,
  HiUserGroup,
  HiShoppingCart,
} from "react-icons/hi";
import { toastConfirm, toastError, toastSuccess } from "@/helpers/alerts.helper";
import {
  getAbandonedCartDashboardService,
  updateAbandonedCartSettingsService,
  triggerAllRemindersService,
} from "@/services/admin.service";
import Loader from "@/components/Loaders/Loader";
import { AbandonedCartDashboard } from "@/types/admin.types";
import TinyLoader from "../Loaders/TinyLoader";

export default function NewsletterManagement() {
  const { token } = useAuth();
  const [sendingNow, setSendingNow] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<AbandonedCartDashboard>({
    isEnabled: false,
    delayHours: "Despues de 24 horas",
    delayValue: "24",
    pendingCount: 0,
    lastExecution: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (token) {
          const dashboardResponse = await getAbandonedCartDashboardService(token);

          setDashboardData({
            isEnabled: dashboardResponse.isEnabled,
            delayHours: dashboardResponse.delayHours,
            delayValue: dashboardResponse.delayValue,
            pendingCount: dashboardResponse.pendingCount,
            lastExecution: dashboardResponse.lastExecution,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toastError("Error al cargar la configuración");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  const [enableLoading, setEnableLoading] = useState(false);

  const handleToggleEnabled = async () => {
    setEnableLoading(true);
    try {
      const newEnabledState = !dashboardData.isEnabled;
      await updateAbandonedCartSettingsService(token!, {
        isEnabled: newEnabledState,
      });
      setDashboardData((prev) => ({
        ...prev,
        isEnabled: newEnabledState,
      }));

      toastSuccess(
        newEnabledState ? "Recordatorio habilitado exitosamente" : "Recordatorio deshabilitado exitosamente"
      );
    } catch (error) {
      console.error("Error toggling:", error);
      toastError("Error al actualizar la configuración");
    } finally {
      setEnableLoading(false);
    }
  };

  const handleFrequencyChange = async (newDelayValue: string) => {
    try {
      await updateAbandonedCartSettingsService(token!, {
        delayHours: newDelayValue,
      });

      setDashboardData((prev) => ({
        ...prev,
        delayValue: newDelayValue,
        delayHours: `Despues de ${newDelayValue} horas`,
      }));

      toastSuccess("Tiempo de espera actualizado exitosamente");
    } catch (error) {
      console.error("Error updating delay:", error);
      toastError("Error al actualizar el tiempo de espera");
    }
  };

  const handleSendNow = async () => {
    if (dashboardData.pendingCount === 0) {
      toastError("No hay carritos abandonados pendientes");
      return;
    }

    toastConfirm(
      `¿Enviar recordatorio a ${dashboardData.pendingCount} usuarios con carritos abandonados?`,
      async () => {
        try {
          setSendingNow(true);
          await triggerAllRemindersService(token!);
          toastSuccess("Recordatorios enviados exitosamente");

          const updatedDashboard = await getAbandonedCartDashboardService(token!);
          setDashboardData((prev) => ({
            ...prev,
            lastExecution: updatedDashboard.lastExecution,
            pendingCount: updatedDashboard.pendingCount,
            delayValue: updatedDashboard.delayValue,
            delayHours: `Despues de ${updatedDashboard.delayValue} horas`,
          }));
        } catch (error) {
          console.error("Error sending:", error);
          toastError("Error al enviar recordatorios");
        } finally {
          setSendingNow(false);
        }
      },
      () => {}
    );
  };

  const frequencyOptions = [
    { value: "24", label: "Despues de 24 horas (1 día)" },
    { value: "48", label: "Despues de 48 horas (2 días)" },
    { value: "72", label: "Despues de 72 horas (3 días)" },
  ];

  const formatLastExecution = (dateString: string) => {
    if (!dateString) return "Nunca";

    try {
      return new Date(dateString).toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* ============[ HEADER RESPONSIVE ]============ */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-font-light">
          Gestión de Recordatorios Automáticos
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          {/* ============[ CARD PRINCIPAL RESPONSIVE ]============ */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-background2/40 rounded-lg border border-slate-700/50">
            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
              <div
                className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center border shrink-0 ${
                  dashboardData.isEnabled
                    ? "from-blue-500/20 to-purple-500/20 border-blue-500/30"
                    : "from-slate-500/20 to-slate-600/20 border-slate-500/30"
                }`}
              >
                <HiMail
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    dashboardData.isEnabled ? "text-blue-300" : "text-slate-400"
                  }`}
                />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-font-light">
                    Recordatorio de Carritos Abandonados
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium w-fit ${
                      dashboardData.isEnabled
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {dashboardData.isEnabled ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Envío único después de que el usuario abandona el carrito
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-initial">
                <p className="text-slate-400 text-xs mb-1">Tiempo de espera</p>
                <p className="text-sm font-medium text-slate-300">{dashboardData.delayHours}</p>
              </div>
            </div>
          </div>

          {/* ============[ STATS Y CONFIGURACIÓN RESPONSIVE ]============ */}
          <div className="bg-background2/40 w-full border border-slate-700/50 rounded-xl p-4 sm:p-6">
            {/* Stats Grid Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HiUserGroup className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                  <p className="text-slate-400 text-xs">Carritos Pendientes</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-font-light">{dashboardData.pendingCount}</p>
                <p className="text-slate-500 text-xs mt-1">Esperando recordatorio</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  <p className="text-slate-400 text-xs">Último Envío</p>
                </div>
                <p className="text-sm sm:text-lg font-semibold text-font-light break-words">
                  {formatLastExecution(dashboardData.lastExecution)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  <p className="text-slate-400 text-xs">Estado</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleEnabled();
                    }}
                    disabled={enableLoading}
                    className={`relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      dashboardData.isEnabled ? "bg-emerald-600" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        dashboardData.isEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs sm:text-sm text-slate-300">
                    {dashboardData.isEnabled && !enableLoading ? (
                      "Habilitado"
                    ) : !dashboardData.isEnabled && !enableLoading ? (
                      "Deshabilitado"
                    ) : !dashboardData.isEnabled && enableLoading ? (
                      <div className="flex items-center gap-1">
                        Habilitando
                        <TinyLoader />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        Desabilitando
                        <TinyLoader />
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Selector de Tiempo Responsive */}
            <div className="border-t border-slate-700/50 pt-4 sm:pt-6 mb-4 sm:mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-3">
                Tiempo de Espera para Enviar Recordatorio
              </label>
              <select
                value={dashboardData.delayValue}
                onChange={(e) => handleFrequencyChange(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light focus:outline-none focus:border-button transition-colors"
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} className="bg-background" value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-2">
                El recordatorio se enviará una sola vez, {dashboardData.delayHours.toLowerCase()} de que el
                usuario abandone el carrito
              </p>
            </div>

            {/* Envío Inmediato Responsive */}
            <div className="border-t border-slate-700/50 pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-slate-300 font-medium mb-1 text-sm sm:text-base">Envío Inmediato</h4>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Envía recordatorios ahora mismo a todos los carritos pendientes, sin esperar el tiempo
                    configurado
                  </p>
                </div>
                <button
                  onClick={handleSendNow}
                  disabled={sendingNow || dashboardData.pendingCount === 0}
                  className="bg-gradient-to-r from-button/80 cursor-pointer to-button hover:from-button hover:to-button/90 text-font-light font-medium py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto text-sm sm:text-base"
                >
                  {sendingNow ? (
                    <>
                      <HiClock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden sm:inline">Enviando...</span>
                      <span className="sm:hidden">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <HiLightningBolt className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Enviar Ahora</span>
                      <span className="sm:hidden">Enviar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============[ INFO BOX RESPONSIVE ]============ */}
      <div className="mt-6 sm:mt-8 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <HiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1 text-sm sm:text-base">
              ¿Cómo funciona el recordatorio?
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm">
              Cuando un usuario agrega productos al carrito pero no completa la compra, el sistema esperará el
              tiempo configurado y luego enviará un único email recordatorio invitándolo a completar su compra.
              Cada carrito recibe solo un recordatorio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
