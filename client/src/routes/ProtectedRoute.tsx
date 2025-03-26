import useAuthStore from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth());

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
