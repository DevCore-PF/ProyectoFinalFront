'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { uploadProfileImageService, updateUserInSession } from '@/services/user.services';
import { useAuth } from '@/context/UserContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

const ProfileSettings = () => {
  const params = useParams();
  const router = useRouter();
  const { user: contextUser, token, isLoading } = useAuth();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  
  useEffect(() => {
    if (isLoading) return; 

    if (!contextUser || !token) {
      router.push('/login');
      return;
    }

    
    if (contextUser.id !== userId) {
      router.push('/dashboard');
      return;
    }

    
    const userProfile: UserProfile = {
      id: contextUser.id,
      name: contextUser.name,
      email: contextUser.email,
      role: contextUser.role || 'student',
      profileImage: undefined 
    };

    
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        const sessionUser = JSON.parse(userData);
        if (sessionUser.profileImage || sessionUser.image) {
          userProfile.profileImage = sessionUser.profileImage || sessionUser.image;
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }

    setUser(userProfile);
    if (userProfile.profileImage) {
      setImagePreview(userProfile.profileImage);
    }
  }, [contextUser, token, isLoading, userId, router]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Por favor selecciona una imagen válida' });
        return;
      }

      
      if (file.size > 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe superar 1MB' });
        return;
      }

      setSelectedImage(file);
      
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage || !user || !token) return;

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      
      const result = await uploadProfileImageService(user.id, selectedImage, token);
      
      if (result.success) {
        
        const updatedUser = { ...user, profileImage: result.imageUrl };
        setUser(updatedUser);
        
        
        updateUserInSession(updatedUser);
        
        setMessage({ type: 'success', text: result.message });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión. Inténtalo nuevamente.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(user?.profileImage || '');
    setMessage({ type: '', text: '' });
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
          <h1 className="text-3xl font-title font-bold text-font-light">
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

          
          <div className="lg:col-span-2">
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
                    <label htmlFor="image-upload" className="block text-sm font-medium text-font-light mb-2">
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
                          'Guardar Imagen'
                        )}
                      </button>
                      
                      <button
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                        className="bg-background2/40 hover:bg-background2/60 text-font-light px-4 py-2 rounded-lg font-semibold transition-all duration-300 border border-border-light/20"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  
                  {message.text && (
                    <div className={`p-3 rounded-lg text-sm ${
                      message.type === 'success' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {message.text}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettings;