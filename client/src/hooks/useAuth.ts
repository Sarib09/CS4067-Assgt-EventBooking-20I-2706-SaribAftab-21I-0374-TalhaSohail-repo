import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { authService } from '../services/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const logout = useCallback(() => {
    authService.logout();
    queryClient.setQueryData('currentUser', null);
    queryClient.invalidateQueries('currentUser');
  }, [queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
};

export default useAuth; 