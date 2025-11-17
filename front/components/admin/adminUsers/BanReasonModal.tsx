import { BanReasonModalProps } from "@/types/admin.types";
import { HiBan } from "react-icons/hi";

const BanReasonModal = ({
  banReason,
  setBanReason,
  onCancel,
  onConfirm,
  isMultiple,
  userCount,
}: BanReasonModalProps) => {
  return (
    <div>
      {
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background2 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
              <HiBan className="w-6 h-6 text-amber-300" />
              {isMultiple ? `Banear ${userCount} usuarios` : "Motivo del Baneo"}
            </h3>

            <p className="text-slate-400 text-sm mb-4">
              Por favor, proporciona un motivo por el cual estás baneando a{" "}
              {isMultiple ? "estos usuarios" : "este usuario"}. Este motivo será
              enviado al correo {isMultiple ? "de cada usuario" : "del usuario"}
              .
            </p>

            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Ej: Violación de términos y condiciones..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-font-light placeholder-slate-500 focus:outline-none focus:border-button/50 min-h-[120px] resize-none"
              autoFocus
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 cursor-pointer bg-slate-800 hover:bg-slate-800/80 text-slate-300 rounded-lg font-medium transition-all border border-slate-600/50"
              >
                Cancelar
              </button>
              <button
                onClick={() => onConfirm()}
                className="flex-1 px-4 py-2 cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-medium transition-all border border-amber-500/50"
              >
                Confirmar Baneo
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default BanReasonModal;
