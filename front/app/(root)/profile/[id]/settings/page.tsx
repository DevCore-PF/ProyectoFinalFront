"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  uploadProfileImageService,
  updateUserProfileService,
  getUserProfileService,
} from "@/services/user.service";
import { useAuth } from "@/context/UserContext";
import { UserProfile, UpdateUserFormData } from "@/types/user.types";
import { updateUserInSession } from "@/helpers/session.helpers";
import PasswordSettings from "@/components/PasswordSettings";

const ProfileSettings = () => {
  const params = useParams();
  const router = useRouter();
  const {
    user: contextUser,
    token,
    isLoading,
    setUser: setContextUser,
    refreshUser,
  } = useAuth();
  const userId = params.id;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Estados para el formulario de perfil
  const [formData, setFormData] = useState<UpdateUserFormData>({
    ciudad: "",
    direccion: "",
    dni: "",
    telefono: "",
    fechaNacimiento: "",
    genero: undefined,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [hasAdditionalInfo, setHasAdditionalInfo] = useState(false);
  const [isEditingAdditionalInfo, setIsEditingAdditionalInfo] = useState(false);
const today = new Date().toISOString().split("T")[0];
  // Cargar imagen inicial del contexto
  useEffect(() => {
    if (contextUser?.profileImage && !imagePreview) {
      setImagePreview(contextUser.profileImage);
    }
  }, [contextUser?.profileImage, imagePreview]);

  useEffect(() => {
    const loadUserData = async () => {
      if (isLoading) return;

      if (!contextUser || !token) {
        router.push("/login");
        return;
      }

      if (contextUser.id !== userId) {
        router.push("/dashboard");
        return;
      }

      try {
        // Cargar datos del usuario desde el backend
        const backendUserData = await getUserProfileService(
          userId as string,
          token
        );

        const userProfile: UserProfile = {
          id: backendUserData.id,
          name: backendUserData.name,
          email: backendUserData.email,
          role: backendUserData.role,
          profileImage:
            backendUserData.profileImage || contextUser.profileImage,
          ciudad: backendUserData.ciudad || "",
          direccion: backendUserData.direccion || "",
          dni: backendUserData.dni || "",
          telefono: backendUserData.telefono || "",
          fechaNacimiento: backendUserData.fechaNacimiento || "",
          genero: backendUserData.genero,
        };

        setUser(userProfile);

        // Inicializar datos del formulario
        setFormData({
          ciudad: userProfile.ciudad || "",
          direccion: userProfile.direccion || "",
          dni: userProfile.dni || "",
          telefono: userProfile.telefono || "",
          fechaNacimiento: userProfile.fechaNacimiento
            ? new Date(userProfile.fechaNacimiento).toISOString().split("T")[0]
            : "",
          genero: userProfile.genero,
        });

        // Verificar si el usuario ya tiene información adicional
        const hasAdditionalData = !!(
          userProfile.ciudad ||
          userProfile.direccion ||
          userProfile.dni ||
          userProfile.telefono ||
          userProfile.fechaNacimiento ||
          userProfile.genero
        );

        setHasAdditionalInfo(hasAdditionalData);
        setIsEditingAdditionalInfo(!hasAdditionalData); // Si no tiene datos, mostrar formulario

        // Preservar la imagen de perfil existente o cargar la del backend
        const imageToShow = userProfile.profileImage || imagePreview;
        if (imageToShow) {
          setImagePreview(imageToShow);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        // Fallback a datos básicos del contexto si hay error
        const basicUserProfile: UserProfile = {
          id: contextUser.id,
          name: contextUser.name,
          email: contextUser.email,
          role: contextUser.role || "student",
          profileImage: contextUser.profileImage,
          ciudad: "",
          direccion: "",
          dni: "",
          telefono: "",
          fechaNacimiento: "",
          genero: undefined,
        };

        setUser(basicUserProfile);
        setHasAdditionalInfo(false);
        setIsEditingAdditionalInfo(true); // Mostrar formulario si hay error
      }
    };

    loadUserData();
  }, [contextUser, token, isLoading, userId, router]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: "Por favor selecciona una imagen válida",
        });
        return;
      }

      if (file.size > 1024 * 1024) {
        setMessage({ type: "error", text: "La imagen no debe superar 1MB" });
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setMessage({ type: "", text: "" });
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage || !user || !token) return;

    setIsUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await uploadProfileImageService(
        user.id,
        selectedImage,
        token
      );

      if (result.success) {
        let finalImageUrl = result.imageUrl;

        // Si el resultado indica que debemos refrescar los datos del usuario
        if (result.imageUrl?.startsWith("refresh_user_data_")) {
          try {
            await refreshUser();
            // Obtener la imagen actualizada del contexto
            const userData = sessionStorage.getItem("user");
            if (userData) {
              const parsedUser = JSON.parse(userData);
              finalImageUrl = parsedUser.profileImage || parsedUser.image || "";
            }
          } catch (refreshError) {
            console.error("Error al refrescar usuario:", refreshError);
            finalImageUrl = ""; // Fallback
          }
        }

        // Actualizar estado local
        const updatedUser = { ...user, profileImage: finalImageUrl };
        setUser(updatedUser);

        // Actualizar contexto global
        if (contextUser) {
          const updatedContextUser = {
            ...contextUser,
            profileImage: finalImageUrl,
          };
          setContextUser(updatedContextUser);
        }

        // Actualizar sessionStorage
        updateUserInSession(updatedUser);

        // Actualizar preview
        setImagePreview(finalImageUrl);

        setMessage({ type: "success", text: result.message });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error de conexión. Inténtalo nuevamente.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(user?.profileImage || "");
    setMessage({ type: "", text: "" });
  };

  // Funciones para el formulario de perfil
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleProfileUpdate = async () => {
    if (!token) return;

    setIsUpdating(true);
    setProfileMessage({ type: "", text: "" });

    try {
      // Filtrar solo los campos que tienen valor
      const dataToUpdate: UpdateUserFormData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          dataToUpdate[key as keyof UpdateUserFormData] = value;
        }
      });

      const result = await updateUserProfileService(dataToUpdate, token);

      if (result) {
        // Actualizar el contexto del usuario
        await refreshUser();

        // Recargar los datos del usuario desde el backend
        const updatedUserData = await getUserProfileService(
          userId as string,
          token
        );
        const updatedUserProfile: UserProfile = {
          id: updatedUserData.id,
          name: updatedUserData.name,
          email: updatedUserData.email,
          role: updatedUserData.role,
          profileImage: updatedUserData.profileImage || user?.profileImage,
          ciudad: updatedUserData.ciudad || "",
          direccion: updatedUserData.direccion || "",
          dni: updatedUserData.dni || "",
          telefono: updatedUserData.telefono || "",
          fechaNacimiento: updatedUserData.fechaNacimiento || "",
          genero: updatedUserData.genero,
        };

        setUser(updatedUserProfile);

        // Verificar si ahora tiene información adicional
        const hasData = !!(
          updatedUserProfile.ciudad ||
          updatedUserProfile.direccion ||
          updatedUserProfile.dni ||
          updatedUserProfile.telefono ||
          updatedUserProfile.fechaNacimiento ||
          updatedUserProfile.genero
        );

        setHasAdditionalInfo(hasData);
        setIsEditingAdditionalInfo(false); // Cambiar a modo visualización

        setProfileMessage({
          type: "success",
          text: "Perfil actualizado exitosamente",
        });

        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setProfileMessage({ type: "", text: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el perfil. Inténtalo nuevamente.";
      setProfileMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-button/20 border-t-button rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-font-light text-lg">Verificando acceso...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-button/20 border-t-button rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-font-light text-lg">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(rgba(255,255,255,0.05)_3px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_1px)] bg-size-[100px_100px]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-accent-light hover:text-button transition-colors mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-3xl  font-bold text-font-light">
            Ajustes de Perfil
          </h1>
          <p className="text-font-light/70 mt-2">
            Personaliza tu perfil y actualiza tu información
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-background2/30 border border-border rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-font-light mb-4">
                Información Personal
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-font-light/70">Nombre</p>
                  <p className="text-font-light font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-font-light/70">Email</p>
                  <p className="text-font-light font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-font-light/70">Rol</p>
                  <span className="inline-block bg-button/20 text-accent-light px-2 py-1 rounded text-sm capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Sección de Foto de Perfil */}
            <div className="bg-background2/30 border border-border rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-font-light mb-6">
                Foto de Perfil
              </h2>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-border-light/20 bg-background2/50">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-font-light/50">
                        <div className="text-center">
                          <div className="text-3xl mb-2">👤</div>
                          <p className="text-xs">Sin imagen</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="block text-sm font-medium text-font-light mb-2"
                    >
                      Seleccionar nueva imagen
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-font-light file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-button file:text-font-light hover:file:bg-button/90 file:cursor-pointer cursor-pointer border border-border-light/20 rounded-lg bg-background2/20"
                    />
                    <p className="text-xs text-font-light/60 mt-1">
                      Formatos: JPG, JPEG, PNG, WEBP. Máximo 1MB.
                    </p>
                  </div>

                  {selectedImage && (
                    <div className="flex gap-3">
                      <button
                        onClick={handleUploadImage}
                        disabled={isUploading}
                        className="bg-button hover:bg-button/90 text-font-light px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                            Subiendo...
                          </>
                        ) : (
                          "Guardar Imagen"
                        )}
                      </button>

                      <button
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                        className="bg-background2/40 cursor-pointer hover:bg-background2/60 text-font-light px-4 py-2 rounded-lg font-semibold transition-all duration-300 border border-border-light/20"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {message.text && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.type === "success"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Información Adicional */}
            <div className="bg-background2/30 border border-border rounded-xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-font-light">
                  Información Adicional
                </h2>
                {hasAdditionalInfo && !isEditingAdditionalInfo && (
                  <button
                    onClick={() => setIsEditingAdditionalInfo(true)}
                    className="bg-button hover:bg-button/90 text-font-light px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    Editar Información Adicional
                  </button>
                )}
              </div>

              {/* Mostrar información completada */}
              {hasAdditionalInfo && !isEditingAdditionalInfo && (
                <div className="space-y-4">
                  <p className="text-sm text-font-light/70 mb-4">
                    Tu información adicional completada
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.ciudad && (
                      <div className="p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">Ciudad</p>
                        <p className="text-font-light font-medium">
                          {user.ciudad}
                        </p>
                      </div>
                    )}
                    {user?.telefono && (
                      <div className="p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">Teléfono</p>
                        <p className="text-font-light font-medium">
                          {user.telefono}
                        </p>
                      </div>
                    )}
                    {user?.dni && (
                      <div className="p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">DNI</p>
                        <p className="text-font-light font-medium">
                          {user.dni}
                        </p>
                      </div>
                    )}
                    {user?.fechaNacimiento && (
                      <div className="p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">
                          Fecha de Nacimiento
                        </p>
                        <p className="text-font-light font-medium">
                          {new Date(user.fechaNacimiento).toLocaleDateString(
                            "es-ES"
                          )}
                        </p>
                      </div>
                    )}
                    {user?.genero && (
                      <div className="p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">Género</p>
                        <p className="text-font-light font-medium capitalize">
                          {user.genero}
                        </p>
                      </div>
                    )}
                    {user?.direccion && (
                      <div className="md:col-span-2 p-3 bg-background2/20 rounded-lg">
                        <p className="text-sm text-font-light/70">Dirección</p>
                        <p className="text-font-light font-medium">
                          {user.direccion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Formulario de edición */}
              {(!hasAdditionalInfo || isEditingAdditionalInfo) && (
                <div>
                  <p className="text-sm text-font-light/70 mb-6">
                    {hasAdditionalInfo
                      ? "Edita tu información adicional"
                      : "Completa tu perfil con información adicional (todos los campos son opcionales)"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ciudad */}
                    <div>
                      <label
                        htmlFor="ciudad"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        Ciudad
                      </label>
                      <input
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        value={formData.ciudad}
                        onChange={handleFormChange}
                        placeholder="Tu ciudad"
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        Teléfono
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleFormChange}
                        placeholder="+54 9 11 1234-5678"
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      />
                    </div>

                    {/* DNI */}
                    <div>
                      <label
                        htmlFor="dni"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        DNI
                      </label>
                      <input
                        id="dni"
                        name="dni"
                        type="text"
                        value={formData.dni}
                        onChange={handleFormChange}
                        placeholder="12345678"
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                      <label
                        htmlFor="fechaNacimiento"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        Fecha de Nacimiento
                      </label>
                      <input
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        max={today}
                        value={formData.fechaNacimiento}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      />
                    </div>

                    {/* Género */}
                    <div>
                      <label
                        htmlFor="genero"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        Género
                      </label>
                      <select
                        id="genero"
                        name="genero"
                        value={formData.genero || ""}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300 [&>option]:bg-background2 [&>option]:text-font-light [&>option]:py-2"
                      >
                        <option
                          value=""
                          className="bg-background2 text-font-light"
                        >
                          Seleccionar género
                        </option>
                        <option
                          value="masculino"
                          className="bg-background2 text-font-light"
                        >
                          Masculino
                        </option>
                        <option
                          value="femenino"
                          className="bg-background2 text-font-light"
                        >
                          Femenino
                        </option>
                        <option
                          value="otro"
                          className="bg-background2 text-font-light"
                        >
                          Otro
                        </option>
                      </select>
                    </div>

                    {/* Dirección - Columna completa */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="direccion"
                        className="block text-sm font-medium text-font-light mb-2"
                      >
                        Dirección
                      </label>
                      <input
                        id="direccion"
                        name="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={handleFormChange}
                        placeholder="Tu dirección completa"
                        className="w-full px-4 py-3 bg-background2/20 border border-border-light/20 rounded-lg text-font-light placeholder-font-light/50 focus:outline-none focus:ring-2 focus:ring-button/50 focus:border-button/50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Botones dinámicos */}
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-3">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={isUpdating}
                        className="bg-button hover:bg-button/90 text-font-light px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-font-light/20 border-t-font-light rounded-full animate-spin"></div>
                            Actualizando...
                          </>
                        ) : (
                          "Guardar Cambios"
                        )}
                      </button>

                      {hasAdditionalInfo && isEditingAdditionalInfo && (
                        <button
                          onClick={() => setIsEditingAdditionalInfo(false)}
                          disabled={isUpdating}
                          className="bg-background2/40 hover:bg-background2/60 text-font-light px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-border-light/20"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>

                    {profileMessage.text && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          profileMessage.type === "success"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {profileMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sección de Configuración de Contraseñas */}
            <PasswordSettings />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettings;
