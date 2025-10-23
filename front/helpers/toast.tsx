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
    description: "¿Are you sure?",
    action: {
      label: "Accept",
      onClick: () => {
        onConfirm();
        toast.dismiss();
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {
        onCancel?.();
        toast.dismiss();
      },
    },
  });
};