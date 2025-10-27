import * as Yup from "yup";
export interface suscriptionFormType {
  email: string;
}
export const suscriptionInitialValues = {
  email: "",
};

export const suscriptionValidation = Yup.object({
  email: Yup.string().email("Email inválido").required("Debes ingresar tu email"),
});
