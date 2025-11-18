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
  const [expandedNewsletter, setExpandedNewsletter] = useState<string | null>(null);
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
  console.log("esta es mi last", dashboardData.lastExecution);
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
      console.log("📤 Enviando al backend:", { delayHours: newDelayValue });

      // 🟢 Enviar el NÚMERO al backend
      await updateAbandonedCartSettingsService(token!, {
        delayHours: newDelayValue, // "24", "72", etc.
      });

      // 🟢 Actualizar el estado local
      setDashboardData((prev) => ({
        ...prev,
        delayValue: newDelayValue, // Guardar el número
        delayHours: `Despues de ${newDelayValue} horas`, // Construir el texto
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
            // 🟢 Actualizar también el delayValue si cambió
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

  const isExpanded = expandedNewsletter === "abandoned-cart";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-font-light mb-2">Gestión de Recordatorios Automáticos</h2>
        <p className="text-slate-400 text-sm">
          Configura el envío automático de recordatorios para carritos abandonados
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <button
            onClick={() => setExpandedNewsletter(isExpanded ? null : "abandoned-cart")}
            className="w-full flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center border ${
                  dashboardData.isEnabled
                    ? "from-blue-500/20 to-purple-500/20 border-blue-500/30"
                    : "from-slate-500/20 to-slate-600/20 border-slate-500/30"
                }`}
              >
                <HiMail
                  className={`w-6 h-6 ${dashboardData.isEnabled ? "text-blue-300" : "text-slate-400"}`}
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-font-light">
                    Recordatorio de Carritos Abandonados
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      dashboardData.isEnabled
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {dashboardData.isEnabled ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Envío único después de que el usuario abandona el carrito
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs mb-1">Tiempo de espera</p>

                <p className="text-sm font-medium text-slate-300">{dashboardData.delayHours}</p>
              </div>
              <HiChevronDown
                className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          <div
            className={`grid grid-cols-1 gap-4 pl-4 transition-all duration-300 overflow-hidden ${
              isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HiUserGroup className="w-5 h-5 text-blue-300" />
                    <p className="text-slate-400 text-xs">Carritos Pendientes</p>
                  </div>
                  <p className="text-2xl font-bold text-font-light">{dashboardData.pendingCount}</p>
                  <p className="text-slate-500 text-xs mt-1">Esperando recordatorio</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HiClock className="w-5 h-5 text-purple-300" />
                    <p className="text-slate-400 text-xs">Último Envío</p>
                  </div>
                  <p className="text-lg font-semibold text-font-light">
                    {formatLastExecution(dashboardData.lastExecution)}
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HiCalendar className="w-5 h-5 text-emerald-300" />
                    <p className="text-slate-400 text-xs">Estado</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEnabled();
                      }}
                      disabled={enableLoading}
                      className={`relative  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        dashboardData.isEnabled ? "bg-emerald-600" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          dashboardData.isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-slate-300">
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

              <div className="border-t border-slate-700/50 pt-6 mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3">
                  Tiempo de Espera para Enviar Recordatorio
                </label>
                <select
                  value={dashboardData.delayValue}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:border-button transition-colors"
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

              <div className="border-t border-slate-700/50 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-slate-300 font-medium mb-1">Envío Inmediato</h4>
                    <p className="text-slate-500 text-sm">
                      Envía recordatorios ahora mismo a todos los carritos pendientes, sin esperar el tiempo
                      configurado
                    </p>
                  </div>
                  <button
                    onClick={handleSendNow}
                    disabled={sendingNow || dashboardData.pendingCount === 0}
                    className="bg-gradient-to-r from-button/80 cursor-pointer to-button hover:from-button hover:to-button/90 text-font-light font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {sendingNow ? (
                      <>
                        <HiClock className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <HiLightningBolt className="w-5 h-5" />
                        Enviar Ahora
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
        <div className="flex gap-3">
          <HiShoppingCart className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1">¿Cómo funciona el recrodatorio?</h4>
            <p className="text-slate-400 text-sm">
              Cuando un usuario agrega productos al carrito pero no completa la compra, el sistema esperará el
              tiempo configurado y luego enviará un único email recordatorio invitándolo a completar su
              compra. Cada carrito recibe solo un recordatorio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
