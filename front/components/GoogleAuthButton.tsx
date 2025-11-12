import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const GoogleAuthButton = ({
  isLoginPage = false,
}: {
  isLoginPage?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleGoogleAuth = () => {
    try {
      setIsLoading(true);
      const authEndpoint = isLoginPage
        ? `${API_URL}/auth/google/login`
        : `${API_URL}/auth/google/register`;

      window.location.href = authEndpoint;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 gap-2 bg-font-light/90 cursor-pointer text-font-dark py-2 rounded-md hover:bg-font-light transition text-xs sm:text-sm px-10 sm:px-4 text-center"
    >
      <FcGoogle size={23} />
      <span className="hidden sm:block text-ellipsis overflow-hidden text-center">
        {isLoading
          ? "Redirigiendo..."
          : isLoginPage
          ? "Ingresa con Google"
          : "Registro con Google"}
      </span>
    </button>
  );
};

export default GoogleAuthButton;
