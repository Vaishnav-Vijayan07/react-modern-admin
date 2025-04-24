import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to login if authentication is required but user is not authenticated
        navigate("/login", { state: { from: location.pathname } });
      } else if (!requireAuth && isAuthenticated) {
        // Redirect to dashboard if user is already authenticated and tries to access login/register
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, requireAuth]);

  // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // If requireAuth is true and user is not authenticated, don't render children (will redirect)
  // If requireAuth is false and user is authenticated, don't render children (will redirect)
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default AuthGuard;
