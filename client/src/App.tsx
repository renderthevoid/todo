import { Header } from "@/components/shared/header";
import useAuthStore from "@/store/authStore";
import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { TaskModal } from "./components/shared/task-modal";
import { Index } from "./pages";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const isAuth = useAuthStore((state) => state.isAuth());
  return (
    <>
      {isAuth && <Header />}
      <TaskModal />
      <Toaster />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route index element={<Index />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
