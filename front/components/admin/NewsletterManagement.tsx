// components/admin/NewsletterManagement.tsx
"use client";

import { useState } from "react";
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
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";

interface NewsletterConfig {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  enabled: boolean;
  frequency: string;
  lastSent: string | null;
  recipientCount?: number;
}

export default function NewsletterManagement() {
  const { token } = useAuth();
  const [expandedNewsletter, setExpandedNewsletter] = useState<string | null>(
    null
  );
  const [sendingNow, setSendingNow] = useState<string | null>(null);

  // Data de ejemplo - esto vendrá de tu backend
  const [newsletters, setNewsletters] = useState<NewsletterConfig[]>([
    {
      id: "abandoned-cart",
      name: "Carritos Abandonados",
      description:
        "Recordatorio automático para usuarios con carritos pendientes",
      targetAudience: "Usuarios con carritos sin completar",
      enabled: true,
      frequency: "Cada 24 horas",
      lastSent: "2025-11-16T10:30:00",
      recipientCount: 47,
    },
    {
      id: "new-courses",
      name: "Nuevos Cursos Disponibles",
      description: "Notificación sobre cursos recién publicados",
      targetAudience: "Todos los usuarios activos",
      enabled: false,
      frequency: "Cada 7 días",
      lastSent: null,
      recipientCount: 0,
    },
 
  ]);

  const toggleNewsletter = (id: string) => {
    setExpandedNewsletter(expandedNewsletter === id ? null : id);
  };

  const handleToggleEnabled = (id: string) => {
    setNewsletters((prev) =>
      prev.map((newsletter) =>
        newsletter.id === id
          ? { ...newsletter, enabled: !newsletter.enabled }
          : newsletter
      )
    );
    toastSuccess("Configuración actualizada");
  };

  const handleSendNow = async (id: string, name: string) => {
    toastConfirm(
      `¿Enviar newsletter "${name}" inmediatamente a todos los destinatarios?`,
      async () => {
        try {
          setSendingNow(id);
          // Aquí irá tu llamada al backend
          // await sendNewsletterNowService(token, id);
          
          // Simulación
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          toastSuccess("Newsletter enviada exitosamente");
          
          setNewsletters((prev) =>
            prev.map((newsletter) =>
              newsletter.id === id
                ? { ...newsletter, lastSent: new Date().toISOString() }
                : newsletter
            )
          );
        } catch (error) {
          toastError("Error al enviar newsletter");
          console.error(error);
        } finally {
          setSendingNow(null);
        }
      },
      () => {}
    );
  };

  const handleFrequencyChange = (id: string, frequency: string) => {
    setNewsletters((prev) =>
      prev.map((newsletter) =>
        newsletter.id === id ? { ...newsletter, frequency } : newsletter
      )
    );
  };

  const frequencyOptions = [
    { value: "Cada 6 horas", label: "Cada 6 horas" },
    { value: "Cada 12 horas", label: "Cada 12 horas" },
    { value: "Cada 24 horas", label: "Cada 24 horas" },
    { value: "Cada 2 días", label: "Cada 2 días" },
    { value: "Cada 7 días", label: "Cada 7 días" },
    { value: "Cada 14 días", label: "Cada 14 días" },
    { value: "Cada 30 días", label: "Cada 30 días" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-font-light mb-2">
          Gestión de Newsletters
        </h2>
        <p className="text-slate-400 text-sm">
          Configura y programa el envío automático de emails a tus usuarios
        </p>
      </div>

      <div className="space-y-6">
        {newsletters.map((newsletter) => {
          const isExpanded = expandedNewsletter === newsletter.id;

          return (
            <div key={newsletter.id} className="space-y-4">
              {/* Header del Newsletter */}
              <button
                onClick={() => toggleNewsletter(newsletter.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center border ${
                      newsletter.enabled
                        ? "from-blue-500/20 to-purple-500/20 border-blue-500/30"
                        : "from-slate-500/20 to-slate-600/20 border-slate-500/30"
                    }`}
                  >
                    <HiMail
                      className={`w-6 h-6 ${
                        newsletter.enabled ? "text-blue-300" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-font-light">
                        {newsletter.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          newsletter.enabled
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {newsletter.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {newsletter.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-slate-400 text-xs mb-1">Frecuencia</p>
                    <p className="text-sm font-medium text-slate-300">
                      {newsletter.frequency}
                    </p>
                  </div>
                  <HiChevronDown
                    className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Contenido expandible */}
              <div
                className={`grid grid-cols-1 gap-4 pl-4 transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                  {/* Información del Newsletter */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HiUserGroup className="w-5 h-5 text-blue-300" />
                        <p className="text-slate-400 text-xs">
                          Destinatarios
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-font-light">
                        {newsletter.recipientCount || 0}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        {newsletter.targetAudience}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <HiClock className="w-5 h-5 text-purple-300" />
                        <p className="text-slate-400 text-xs">
                          Último Envío
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-font-light">
                        {newsletter.lastSent
                          ? new Date(newsletter.lastSent).toLocaleString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Nunca"}
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
                            handleToggleEnabled(newsletter.id);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            newsletter.enabled ? "bg-emerald-600" : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              newsletter.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-sm text-slate-300">
                          {newsletter.enabled ? "Habilitado" : "Deshabilitado"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Configuración de Frecuencia */}
                  <div className="border-t border-slate-700/50 pt-6 mb-6">
                    <label className="block text-slate-300 text-sm font-medium mb-3">
                      Frecuencia de Envío
                    </label>
                    <select
                      value={newsletter.frequency}
                      onChange={(e) =>
                        handleFrequencyChange(newsletter.id, e.target.value)
                      }
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:border-button transition-colors"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option.value} className="bg-background" value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-slate-500 text-xs mt-2">
                      El sistema enviará automáticamente este newsletter según
                      la frecuencia configurada
                    </p>
                  </div>

                  {/* Botón de Envío Inmediato */}
                  <div className="border-t border-slate-700/50 pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-slate-300 font-medium mb-1">
                          Envío Inmediato
                        </h4>
                        <p className="text-slate-500 text-sm">
                          Envía este newsletter ahora mismo a todos los
                          destinatarios elegibles
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleSendNow(newsletter.id, newsletter.name)
                        }
                        disabled={
                          sendingNow === newsletter.id ||
                          !newsletter.recipientCount
                        }
                        className="bg-gradient-to-r from-button/80 cursor-pointer to-button hover:from-button hover:to-button/90 text-font-light font-medium py-2.5 px-5 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {sendingNow === newsletter.id ? (
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
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
        <div className="flex gap-3">
          <HiShoppingCart className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1">
              Sobre Carritos Abandonados
            </h4>
            <p className="text-slate-400 text-sm">
              El newsletter de carritos abandonados se enviará automáticamente
              según la frecuencia configurada. Los usuarios recibirán un
              recordatorio para completar su compra con los productos que
              dejaron en el carrito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
