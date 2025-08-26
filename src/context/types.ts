export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}
