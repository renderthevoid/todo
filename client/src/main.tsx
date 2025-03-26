import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner"
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </BrowserRouter>
);
