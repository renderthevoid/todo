import axiosClient from "@/api/axiosClient";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Container } from "./container";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const logoutHandler = async () => {
    try {
      await axiosClient.post("/api/logout");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };
  return (
    <header className={cn("py-6 border-b" , className)}>
      <Container>
        <div className="flex justify-end w-full">
          <Button variant="outline" size="icon" onClick={logoutHandler}>
            <LogOut />
          </Button>
        </div>
      </Container>
    </header>
  );
};
