import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IAuthStore {
  accessToken: string | null;
  userId: string | null;
  userRole: string | null;
  isAuth: () => boolean;
  login: (token: string, userId: string, role: string) => void;
  logout: () => void;
}

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userId: null,
      userRole: null,

      isAuth: () => !!get().accessToken,

      login: (token: string, userId: string, role: string) => {
        set({ accessToken: token, userId: userId, userRole: role });
      },

      logout: () => {
        set({ accessToken: null, userId: null, userRole: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
