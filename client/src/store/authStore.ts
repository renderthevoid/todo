import { create } from "zustand";
interface IAuthStore {
  accessToken: string | null;
  userId: string | null;
  isAuth: () => boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
}
const useAuthStore = create<IAuthStore>((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  userId: localStorage.getItem("userId") || null,

  isAuth: () => !!get().accessToken,

  login: (token: string, userId: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", userId);
    set({ accessToken: token, userId: userId });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null });
  },
}));

export default useAuthStore;
