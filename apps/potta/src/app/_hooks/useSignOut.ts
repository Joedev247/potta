import { useAuth } from '../(routes)/auth/AuthContext';

export const useSignOut = () => {
  const { signOut } = useAuth();
  
  return {
    signOut,
    signOutWithConfirm: () => {
      if (confirm('Are you sure you want to sign out?')) {
        signOut();
      }
    }
  };
}; 