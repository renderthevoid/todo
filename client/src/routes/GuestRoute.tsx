import { useAuthStore} from "@/store";
import { Navigate, Outlet } from "react-router";

const GuestRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth()); 

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
