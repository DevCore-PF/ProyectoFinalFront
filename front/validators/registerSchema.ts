import * as Yup from "yup";
export interface registerType {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const registerInitialValues = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
};

export const registerValidations = Yup.object({
  name: Yup.string()
    .required("Nombre requerido")
    .min(3, "Mínimo debe ser 3 caracteres")
    .max(35, "Máximo de debe ser 35 caracteres"),

  email: Yup.string().required("Email requerido").email("Email invalido"),

  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo debe ser 6 caracteres")
    .max(15, "Máximo debe ser 15 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(/[!@#$%^&*(),.?":{}|<>-]/, "Debe inlcuir un catacter especial"),

  repeatPassword: Yup.string()
    .required("Debe confirmar contraseña")
    .oneOf([Yup.ref("password")],"Contraseñas deben coincidir"),
});
