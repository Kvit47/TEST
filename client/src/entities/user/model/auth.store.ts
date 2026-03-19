import { create } from 'zustand';
import { signIn, signOut, getSession } from 'next-auth/react';
import { authAPI, userAPI } from '../service/auth.api';
import { useCartStore } from '../../../views/card/model/card.store';
import { User, UserRole } from '@/src/entities/user/types/user.types';
import { UserSchema } from '../model/user.schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  // users management
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  changingRole: string | null;

  signin: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;

  patchUser: (data: UserSchema) => Promise<void>;

  fetchUsers: () => Promise<void>;
  changeUserRole: (userId: string, role: 'client' | 'admin') => Promise<void>;
  clearUsersError: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  users: [],
  usersLoading: false,
  usersError: null,
  changingRole: null,

  signup: async (username: string, email: string, password: string) => {
    set({ loading: true });
    try {
      await authAPI.register(username, email, password);

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      const session = await getSession();
      if (session?.user) {
        const { serverToken, id, ...rest } = session.user as {
          serverToken: string;
          id: string;
          username: string;
          email: string;
          role: string;
        };
        localStorage.setItem('token', serverToken);
        const user: User = { _id: id, ...rest } as User;
        set({ token: serverToken, user, isAuthenticated: true });
      }
    } finally {
      set({ loading: false });
    }
  },

  signin: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error || 'Invalid credentials');
      }

      const session = await getSession();
      if (session?.user) {
        const { serverToken, id, ...rest } = session.user as {
          serverToken: string;
          id: string;
          username: string;
          email: string;
          role: string;
        };
        localStorage.setItem('token', serverToken);
        const user: User = { _id: id, ...rest } as User;

        const cartStore = useCartStore.getState();
        if (cartStore.userId && cartStore.userId !== user._id) {
          cartStore.clearForUserSwitch();
        }

        set({ token: serverToken, user, isAuthenticated: true });
        await cartStore.loadAndMergeFromServer(user._id);
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    signOut({ redirect: false });
  },

  fetchUsers: async () => {
    set({ usersLoading: true, usersError: null });
    try {
      const users = await userAPI.getAllUsers();
      set({ users });
    } catch (err) {
      set({ usersError: err instanceof Error ? err.message : 'Failed to fetch users' });
    } finally {
      set({ usersLoading: false });
    }
  },

  changeUserRole: async (userId: string, role: 'client' | 'admin') => {
    set({ changingRole: userId, usersError: null });
    try {
      const updated = await userAPI.changeUserRole(userId, role);
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, role: updated?.role ?? (role as UserRole) } : u
        ),
      }));
    } catch (err) {
      set({ usersError: err instanceof Error ? err.message : 'Failed to change role' });
    } finally {
      set({ changingRole: null });
    }
  },

  patchUser: async (data: UserSchema) => {
    set({ loading: true });
    try {
      const response = await userAPI.updateProfile(data);
      const updatedUser: User = response.data ?? response;
      set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : state.user,
      }));
    } finally {
      set({ loading: false });
    }
  },

  clearUsersError: () => set({ usersError: null }),

  initialize: async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        const { serverToken, id, ...rest } = session.user as {
          serverToken: string;
          id: string;
          username: string;
          email: string;
          role: string;
        };
        localStorage.setItem('token', serverToken);
        const user: User = { _id: id, ...rest } as User;
        set({ token: serverToken, user, isAuthenticated: true });

        const cartStore = useCartStore.getState();
        await new Promise((resolve) => setTimeout(resolve, 0));
        await cartStore.loadFromServer(user._id);
      } else {
        set({ loading: false, isAuthenticated: false });
      }
    } catch {
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
