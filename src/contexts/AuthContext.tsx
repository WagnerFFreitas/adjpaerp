import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, unitsApi } from '@/lib/api';
import { AppRole, Profile, Unit } from '@/types/database';

interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  unit_id?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  currentUnit: Unit | null;
  units: Unit[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  setCurrentUnit: (unit: Unit) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [currentUnit, setCurrentUnitState] = useState<Unit | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const userData = await authApi.me();
      
      setProfile(userData as Profile);
      setRoles((userData.roles || []) as AppRole[]);

      // Fetch available units
      const unitsData = await unitsApi.list();
      setUnits(unitsData as Unit[]);
      
      // Set default unit
      if (unitsData && unitsData.length > 0) {
        const defaultUnit = userData.default_unit_id 
          ? unitsData.find((u: Unit) => u.id === userData.default_unit_id)
          : unitsData.find((u: Unit) => u.is_headquarter) || unitsData[0];
        
        if (defaultUnit) {
          setCurrentUnitState(defaultUnit as Unit);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setUser(null);
      setProfile(null);
      setRoles([]);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adjpa_token');
      const savedUser = localStorage.getItem('adjpa_user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          await fetchProfile();
        } catch (error) {
          console.error('Error checking auth:', error);
          localStorage.removeItem('adjpa_token');
          localStorage.removeItem('adjpa_user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.message || 'Erro ao fazer login') };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setProfile(null);
      setRoles([]);
      setCurrentUnitState(null);
    }
  };

  const hasRole = useCallback((role: AppRole) => {
    return roles.includes(role) || roles.includes('admin');
  }, [roles]);

  const hasAnyRole = useCallback((checkRoles: AppRole[]) => {
    return roles.includes('admin') || checkRoles.some(role => roles.includes(role));
  }, [roles]);

  const setCurrentUnit = useCallback((unit: Unit) => {
    setCurrentUnitState(unit);
  }, []);

  const value = {
    user,
    profile,
    roles,
    currentUnit,
    units,
    loading,
    signIn,
    signOut,
    hasRole,
    hasAnyRole,
    setCurrentUnit,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
