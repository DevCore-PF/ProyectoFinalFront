// components/Modal.tsx

import { CourseModalProps } from "@/types/admin.types";

const CourseModal = ({
  isOpen,
  onClose,
  children,
  title,
}: CourseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop de fondo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

   
      <div className="relative bg-background border border-slate-700 rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto m-4">
        {title && (
          <div className="sticky top-0 bg-background2 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-font-light">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default CourseModal;
