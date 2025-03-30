import axiosClient from "@/api/axiosClient";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { ListPlus, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Container } from "./container";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { userId } = useAuthStore();
  const { logout } = useAuthStore();
  const { openModal } = useModalStore();
  const logoutHandler = async () => {
    try {
      await axiosClient.post("/api/logout");
      logout();
      window.location.href = "/login"
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };
  return (
    <header className={cn("py-6 border-b", className)}>
      <Container>
        <div className="flex justify-end w-full gap-2">
          {userId}
          <Button variant="outline" size="icon" onClick={() => openModal()}>
            <ListPlus />
          </Button>
          <Button variant="outline" size="icon" onClick={logoutHandler}>
            <LogOut />
          </Button>
        </div>
      </Container>
    </header>
  );
};
