import * as Yup from "yup";
export interface RegisterType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkBoxTerms: boolean;
}

export interface RegisterResponse {
  access_token: string;
  user: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
  };
}
export const registerInitialValues = {
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
// La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*,La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*
export interface roleType {
  role: string;
}

export const roleValidation = Yup.object({
  role: Yup.string().required("Debes seleccionar un rol"),
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
  checkboxInfo: boolean;
  checkboxTerms: boolean;
  checkboxSupervision: boolean;
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
  checkboxInfo: false,
  checkboxTerms: false,
  checkboxSupervision: false,
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

  bio: Yup.string()
    .required("Biografia es requerida")
    .min(30, "Mínimo 30 caracteres")
    .max(250, "Máximo 250 caracteres"),

  checkboxInfo: Yup.boolean().oneOf(
    [true],
    "Debes declarar que la información es verídica"
  ),

  checkboxTerms: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los Términos y Condiciones"
  ),

  checkboxSupervision: Yup.boolean().oneOf(
    [true],
    "Debes aceptar que tu solicitud está sujeta a revisión"
  ),
});
