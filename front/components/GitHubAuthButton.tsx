import { FaGithub } from "react-icons/fa";

import { usePathname } from "next/navigation";

const GitHubAuthButton = () => {
  const handleGitHubAuth = () => {
    window.location.href = "http://localhost:3001/auth/github";
  };
  const pathname = usePathname();

  return (
    <button
      type="button"
      onClick={handleGitHubAuth}
      className="flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 justify-center gap-2 bg-slate-900 text-font-light py-2 rounded-md hover:bg-slate-900/40 transition text-xs sm:text-sm px-10 sm:px-4"
    >
      <FaGithub size={30} />
      <span className={`hidden sm:block text-ellipsis overflow-hidden text-center`}>
        {pathname === "/login" ? "Ingresa con GitHub" : "Registro con GitHub"}
      </span>
    </button>
  );
};

export default GitHubAuthButton;
