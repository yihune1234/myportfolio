/**
 * RoleRoute — redirects to /unauthorized if user.role not in allowedRoles[].
 * Role-gating is done at the route level, never in components.
 */
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}