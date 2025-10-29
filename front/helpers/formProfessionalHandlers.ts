import { ChangeEvent } from "react";
import { FormikValues } from "formik";

//Register
export const addCertificate = (formik: FormikValues) => {
  formik.setFieldValue("certificates", [...formik.values.certificates, null]);
};

export const closeCertificate = (id: number, formik: FormikValues) => {
  if (formik.values.certificates.length === 1) return;
  const newFiles = formik.values.certificates.filter(
    (_: any, idx: number) => idx !== id
  );
  formik.setFieldValue("certificates", newFiles);
};

export const addLink = (formik: FormikValues) => {
  if (formik.values.links) {
    formik.setFieldValue("links", [...formik.values.links, ""]);
  }
};

export const closeLink = (id: number, formik: FormikValues) => {
  if (formik.values.links?.length === 1) return;
  if (formik.values.links) {
    const newFiles = formik.values.links.filter(
      (_: any, idx: number) => idx !== id
    );
    formik.setFieldValue("links", newFiles);
  }
};

export const handleChangeLink = (
  e: ChangeEvent<HTMLInputElement>,
  id: number,
  formik: FormikValues
) => {
  if (formik.values.links) {
    const newLinks = [...formik.values.links];
    newLinks[id] = e.target.value;
    formik.setFieldValue("links", newLinks);
  }
};

export const handleChangeCertificate = async (
  e: ChangeEvent<HTMLInputElement>,
  id: number,
  formik: FormikValues
) => {
  const files = [...formik.values.certificates];
  files[id] = e.target.files?.[0] || null;

  await formik.setFieldValue("certificates", files);
  formik.setFieldTouched("certificates", true, true);
};

export const handleBlurCertificate = (formik: FormikValues) => {
  formik.setFieldTouched("certificates", true, true);
};

export const handleChangePicture = async (
  e: ChangeEvent<HTMLInputElement>,
  formik: FormikValues
) => {
  const file = e.target.files?.[0] || null;

  await formik.setFieldValue("picture", file);
  formik.setFieldTouched("picture", true, true); // El tercer parámetro fuerza la validación
};

export const handleBlurPicture = (formik: FormikValues) => {
  formik.setFieldTouched("picture", true, true);
};

export const handleChangeBio = (
  e: ChangeEvent<HTMLTextAreaElement>,
  formik: FormikValues
) => {
  formik.handleChange(e);
  formik.setFieldTouched("bio", true, true);
};
