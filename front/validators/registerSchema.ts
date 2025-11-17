import { RegisterFormData } from "@/types/auth.types";
import * as Yup from "yup";

export const registerInitialValues: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  checkBoxTerms: false,
};

export const registerValidations = Yup.object({
  name: Yup.string()
    .required("Nombre requerido")
    .min(3, "Mínimo debe ser 3 caracteres")
    .max(35, "Máximo de debe ser 35 caracteres"),

  email: Yup.string().required("Email requerido").email("Email inválido"),

  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo debe ser 6 caracteres")
    .max(15, "Máximo debe ser 15 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(/[!@#$%^&*]/, "Debe inlcuir un catacter especial !@#$%^&*"),

  confirmPassword: Yup.string()
    .required("Debe confirmar contraseña")
    .oneOf([Yup.ref("password")], "Contraseñas deben coincidir"),
  checkboxTerms: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los Términos y Condiciones"
  ),
});

export const roleValidation = Yup.object({
  role: Yup.string().required("Debes seleccionar un rol"),
});

export const registerAdminValidation = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es requerido"),
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo debe ser 6 caracteres")
    .max(15, "Máximo debe ser 15 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(/[!@#$%^&*]/, "Debe inlcuir un catacter especial !@#$%^&*"),
  confirmPassword:Yup.string()
    .required("Debe confirmar contraseña")
    .oneOf([Yup.ref("password")], "Contraseñas deben coincidir"),
});
