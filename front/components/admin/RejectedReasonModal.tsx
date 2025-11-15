import { RejectedReasonModalProps } from "@/types/admin.types";
import { HiBan } from "react-icons/hi";

const RejectedReasonModal = ({
  rejectedReason,
  setRejectedReason,
  onCancel,
  onConfirm,
}: RejectedReasonModalProps) => {
  return (
    <div>
      {
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background2 border border-slate-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
              <HiBan className="w-6 h-6 text-amber-300" />
              Motivo de Rechazo
            </h3>

            <p className="text-slate-400 text-sm mb-4">
              Por favor, proporciona un motivo por el cual estás rechazando a
              este perfil. Este motivo será enviado al correo del usuario.
            </p>

            <textarea
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
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
                onClick={onConfirm}
                className="flex-1 px-4 py-2 cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-medium transition-all border border-amber-500/50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default RejectedReasonModal;
