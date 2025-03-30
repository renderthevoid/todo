import { Header } from "@/components/shared/header";
import { useAuthStore } from "@/store";
import { Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { IndexPage } from "./pages";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const isAuth = useAuthStore((state) => state.isAuth());
  return (
    <>
      {isAuth && <Header />}
      <Toaster />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route index element={<IndexPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
