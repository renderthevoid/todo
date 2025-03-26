import { create } from "zustand";
interface IAuthStore {
  accessToken: string | null;
  isAuth: () => boolean;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<IAuthStore>((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,

  isAuth: () => !!get().accessToken,

  login: (token: string) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null });
  },
}));

export default useAuthStore;
