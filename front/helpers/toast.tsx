import { toast } from "sonner";

import { CiCircleCheck } from "react-icons/ci";
import { CiCircleAlert } from "react-icons/ci";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    icon: <CiCircleCheck size={19} className="text-green-500" />,
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    icon: <CiCircleAlert size={19} />,
  });
};

export const toastConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast(message, {
    id: "confirm-toast",
    duration: 40000,
    closeButton: false,
    description: "¿Estás seguro?",
    position: "top-center",
    className:
      "bg-[#242645] border border-[#3F4273] shadow-lg shadow-purple-500/10 text-lg",
    descriptionClassName: "text-gray-300 text-base",
    style: {
      background: "#242645",
      border: "1px solid #3F4273",
      color: "#ffffff",
      padding: "30px",
      minWidth: "500px",
      maxWidth: "600px",
      fontSize: "16px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    action: {
      label: "Aceptar",
      onClick: () => {
        onConfirm();
        toast.dismiss();
      },
    },
    cancel: {
      label: "Cancelar",
      onClick: () => {
        onCancel?.();
        toast.dismiss();
      },
    },
    actionButtonStyle: {
      background: "#7e4bde",
      color: "#ffffff",
      border: "none",
      padding: "20px 20px",
      margin: "6px 10px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "15px",
      cursor: "pointer",
      flexShrink: 0,
      transition: "all 0.3s ease",
    },
    cancelButtonStyle: {
      background: "#3F4273",
      color: "#d1d5db",
      border: "1px solid #4B5280",
      padding: "20px 20px",
      margin: "6px 10px 6px 20px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "15px",
      cursor: "pointer",
      flexShrink: 0,
      transition: "all 0.2s ease",
    },
  });
};
