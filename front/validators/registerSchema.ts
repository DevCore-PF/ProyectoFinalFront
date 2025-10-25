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

  email: Yup.string().required("Email requerido").email("Email inválido"),

  password: Yup.string()
    .required("Contraseña es requerida")
    .min(6, "Mínimo debe ser 6 caracteres")
    .max(15, "Máximo debe ser 15 caracteres")
    .matches(/[A-Z]/, "Debe incluir una mayúscula")
    .matches(/[0-9]/, "Debe incluir un número")
    .matches(/[!@#$%^&*(),.?":{}|<>-]/, "Debe inlcuir un catacter especial"),

  repeatPassword: Yup.string()
    .required("Debe confirmar contraseña")
    .oneOf([Yup.ref("password")], "Contraseñas deben coincidir"),
});

export interface professionalFormType {
  fullName: string;
  email: string;
  phone: string | null;
  picture: File | null;
  profession: string;
  area: string;
  bio: string;
  certificates: (File | null)[];
  links: string[] | null;
}

export const professionalForm = {
  fullName: "",
  email: "",
  phone: "",
  picture: null,
  profession: "",
  area: "",
  bio: "",
  certificates: [null],
  links: [""],
};

export const professionalFormValidation = Yup.object({
  fullName: Yup.string()
    .required("Nombre requerido")
    .min(3, "Mínimo debe ser 3 caracteres"),

  email: Yup.string().required("Email requerido").email("Email inválido"),

  picture: Yup.mixed()
    .required("Foto de perfil requerida")
    .test("fileType", "El archivo debe ser una imagen", (value) => {
      if (!value || !(value instanceof File)) return false;
      return value.type.startsWith("image/");
    })
    .test("fileExtension", "Solo se permiten JPG o PNG", (value) => {
      if (!value || !(value instanceof File)) return true;
      return ["image/jpeg", "image/png"].includes(value.type);
    })
    .test("fileSize", "La imagen no puede superar los 2 MB", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 2 * 1024 * 1024;
    }),

  profession: Yup.string().required("Profesión requerida"),

  area: Yup.string().required("Especialización requerida"),

  certificates: Yup.array()
    .of(
      Yup.mixed<File>()
        .nullable()
        .test("fileType", "Solo se permiten imágenes o PDF", (value) => {
          if (!value) return true;
          return [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
          ].includes((value as File).type);
        })
    )
    .test("atLeastOne", "Se requiere por lo menos una certificación", (arr) => {
      if (!arr || !Array.isArray(arr)) return false;
      return arr.some((v) => v instanceof File);
    }),
});
