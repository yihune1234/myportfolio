/**
 * AuthContext — authentication source of truth for the entire app.
 * Stores JWT in memory (useRef). Provides login/logout.
 * Never stores token in localStorage.
 */
import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLogoutHandler } from '@/lib/axiosInstance';
import { ROLE_DASHBOARD_ROUTES } from '@/constants/roles';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const tokenRef = useRef(null);
  const navigate = useNavigate();

  // Register the logout handler with axios interceptor
  useEffect(() => {
    setLogoutHandler(() => {
      tokenRef.current = null;
      setUser(null);
      setAuthToken(null);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Import dynamically to avoid circular dependency
      const { login: loginService } = await import('@/services/authService');
      const result = await loginService(email, password);

      const { user: userData, token } = result;

      // Store in memory (useRef — no re-render)
      tokenRef.current = token;
      setAuthToken(token);

      // Store user (useState — triggers re-render)
      setUser(userData);

      // Role-based redirect
      const dashboardRoute = ROLE_DASHBOARD_ROUTES[userData.role];
      if (dashboardRoute) {
        navigate(dashboardRoute, { replace: true });
      }

      return result;
    } catch (error) {
      const message = error.message || 'Login failed. Please try again.';
      setAuthError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    tokenRef.current = null;
    setUser(null);
    setAuthToken(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = {
    user,
    token: tokenRef.current,
    isAuthenticated: !!user,
    isLoading,
    authError,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}