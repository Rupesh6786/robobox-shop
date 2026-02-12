import { create } from "zustand";
import { db } from "./src/config";
import { doc, getDoc } from "firebase/firestore";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  cart: [],
  fetchuserInfo: async (uid) => {
    set({ isLoading: true });
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ currentUser: data, cart: data.cart || [], isLoading: false });
      } else {
        console.log("No such document!");
        set({ currentUser: null, isLoading: false });
      }
    } catch (e) {
      console.error("Error fetching user document:", e);
      set({ currentUser: null, isLoading: false });
    }
  },
  setCart: (cart) => set({ cart }),
}));
