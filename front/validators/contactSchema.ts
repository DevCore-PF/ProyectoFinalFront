import { ContactFormData } from "@/types/forms.types";
import * as Yup from "yup";


export const contactInitialValues:ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export const contactValidations = Yup.object({
  name: Yup.string().required("El nombre es requerido"),

  email: Yup.string()
    .email("Email inválido")
    .required("El nombre es requerido"),

  subject: Yup.string().required("El motivo es requerido"),

  message: Yup.string()
    .required("El mensaje es requerido")
    .min(10, "Mínimo 10 caracteres")
    .max(300, "Máximo 300 caracteres"),
});
