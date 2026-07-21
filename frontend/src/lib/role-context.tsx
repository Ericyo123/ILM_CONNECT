'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AdminRole = 'owner' | 'staff';

interface RoleContextType {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AdminRole>('owner');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount to prevent hydration mismatch
    const stored = localStorage.getItem('ilm_admin_role') as AdminRole;
    if (stored === 'staff' || stored === 'owner') {
      setRoleState(stored);
    }
    setIsMounted(true);
  }, []);

  const setRole = (newRole: AdminRole) => {
    setRoleState(newRole);
    localStorage.setItem('ilm_admin_role', newRole);
  };

  // Prevent rendering until we've read from localStorage to avoid flashing the wrong role
  if (!isMounted) return <div className="min-h-screen bg-[hsl(var(--background))]" />;

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
