import { ProfessionalFormData } from "@/types/professionalValidation.types";
import * as Yup from "yup";

export const professionalInitialValues: ProfessionalFormData = {
  phone: "",
  profession: "",
  speciality: "",
  biography: "",
  certificates: [null],
  professionalLinks: [""],
  agreedToTerms: false,
  agreedToInfo: false,
  agreedToAproveed: false,
};

export const professionalValidation = Yup.object({
  profession: Yup.string()
    .required("La profesión es requerida")
    .min(3, "Mínimo 3 caracteres"),

  speciality: Yup.string()
    .required("La especialidad es requerida")
    .min(3, "Mínimo 3 caracteres"),

  biography: Yup.string().max(500, "Máximo 500 caracteres"),

  phone: Yup.string().matches(
    /^[\d\s\-\+\(\)]*$/,
    "Formato de teléfono inválido"
  ),
  certificates: Yup.array()
    .of(
      Yup.mixed()
        .required("Debes subir un certificado")
        .test(
          "fileType",
          "Solo se permiten archivos PDF, JPG, JPEG o PNG",
          (value) => {
            if (!value || !(value instanceof File)) return false; // Verifica que sea un File
            return [
              "application/pdf",
              "image/jpeg",
              "image/jpg",
              "image/png",
            ].includes(value.type);
          }
        )
        .test(
          "fileSize",
          "El archivo es demasiado grande (máx. 5MB)",
          (value) => {
            if (!value || !(value instanceof File)) return false;
            return value.size <= 5 * 1024 * 1024; 
          }
        )
    )
    .min(1, "Debes subir al menos un certificado")
    .required("Los certificados son obligatorios"),

  professionalLinks: Yup.array().of(
    Yup.string().url("Debe ser una URL válida")
  ),

  agreedToTerms: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones"
  ),

  agreedToInfo: Yup.boolean().oneOf(
    [true],
    "Debes confirmar que la información es verídica"
  ),

  agreedToAproveed: Yup.boolean().oneOf(
    [true],
    "Debes aceptar el proceso de revisión"
  ),
});
