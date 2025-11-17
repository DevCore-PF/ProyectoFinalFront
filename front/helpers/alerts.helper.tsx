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
    icon: <CiCircleAlert size={19} className="text-amber-500" />,
    className: "bg-amber-500/10 border border-amber-500/30",
    descriptionClassName: "text-amber-300",
  });
};


// export const toastConfirm = (
//   message: string,
//   onConfirm: () => void,
//   onCancel?: () => void
// ) => {
//   toast(message, {
//     duration: 40000,
//     icon: <CiCircleAlert size={21} className="text-amber-600" />,
//     description: "¿Estás seguro?",
//     position: "top-center",
//     className:
//       "bg-[#242645] border border-[#3F4273] shadow-lg shadow-purple-500/10",
//     descriptionClassName: "text-gray-300",
//     action: {
//       label: "Aceptar",
//       onClick: () => {
//         onConfirm();
//         toast.dismiss();
//       },
//     },
//     cancel: {
//       label: "Cancelar",
//       onClick: () => {
//         onCancel?.();
//         toast.dismiss();
//       },
//     },
//     actionButtonStyle: {
//       background: "#1f213c",
//       color: "#ffffff",
//       padding: "10px 18px",
//       borderRadius: "6px",
//       fontWeight: "600",
//       fontSize: "15px",
//       transition: "all 0.2s ease",
//     },
//     cancelButtonStyle: {
//       background: "#c64f06",
//       color: "#d1d5db",
//       border: "1px solid #c64f06",
//       padding: "10px 18px",
//       borderRadius: "6px",
//       fontWeight: "600",
//       fontSize: "15px",
//       transition: "all 0.2s ease",
//     },
//   });
// };
export const toastConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast(message, {
    duration: 40000,
    icon: <CiCircleAlert size={21} className="text-amber-600 flex-shrink-0" />,
    description: "¿Estás seguro?",
    position: "top-center",
    className:
      "bg-[#242645] border border-[#3F4273] shadow-lg shadow-purple-500/10 min-w-[400px] max-w-[500px]",
    descriptionClassName: "text-gray-300",
    style: {
      padding: "16px",
      gap: "12px",
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
      background: "#1f213c",
      color: "#ffffff",
      padding: "10px 18px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "15px",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
    cancelButtonStyle: {
      background: "#c64f06",
      color: "#d1d5db",
      border: "1px solid #c64f06",
      padding: "10px 18px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "15px",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
  });
};