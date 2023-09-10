import { router } from '@/routes';
import { useConvexAuth } from 'convex/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useRequireAuth() {
  const location = useLocation()
  const { isLoading, isAuthenticated } = useConvexAuth()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // If not authenticated, redirect to the login page
      router.navigate('/login?next=' + location.pathname);
    }
  }, [location, isAuthenticated, isLoading]);

   return { isLoading: isLoading || !isAuthenticated };
}

export default useRequireAuth;