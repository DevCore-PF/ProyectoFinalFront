"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
//Next
import { usePathname } from "next/navigation";
//Icons
import { FcGoogle } from "react-icons/fc";
const GoogleAuthButton = () => {
  const handleGoogleAuth = () => {
    window.location.href = `${API_URL}/auth/google`;
  };
  const pathname = usePathname();
  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 gap-2 bg-font-light/90 cursor-pointer text-font-dark py-2 rounded-md hover:bg-font-light transition text-xs sm:text-sm  px-10  sm:px-4  text-center "
    >
      <FcGoogle size={23}/>
      <span
        className={`hidden sm:block text-ellipsis overflow-hidden text-center`}
      >
        {pathname === "/login" ? "Ingresa con Google" : "Registro con Google"}
      </span>
    </button>
  );
};

export default GoogleAuthButton;
