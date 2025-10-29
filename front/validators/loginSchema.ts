import * as Yup from "yup";

export interface LoginType {
  email: string;
  password: string;
}

export const loginInitialValues: LoginType = {
  email: "",
  password: "",
};

export const loginValidations = Yup.object({
  email: Yup.string().email("Email inválido").required("Email requerido"),
  password: Yup.string()
    .min(8, "Mínimo debe ser 8 caracteres")
    .max(15, "Máximo debe ser 15 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[a-z]/, "Debe incluir una minúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Debe incluir un carácter especial"
    )
    .required("Contraseña es requerida"),
});
