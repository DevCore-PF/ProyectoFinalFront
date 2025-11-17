import { useAdmin } from "@/context/AdminContext";
import { getAllUsersService } from "@/services/admin.service";
import { User } from "@/types/user.types";
import { useEffect } from "react";
import { HiUsers } from "react-icons/hi";

const UsersStatistics = () => {
  const { users, refreshUsers } = useAdmin();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        await refreshUsers();
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchAllUsers();
  }, [users]);

  return (
    <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <HiUsers className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      <h3 className="text-slate-400 text-sm mb-1">Total Usuarios</h3>
      <p className="text-xl font-bold text-font-light">{`${users.length}`}</p>
    </div>
  );
};

export default UsersStatistics;
