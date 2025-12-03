// apps\web\src\features\auth\hooks\useOnboarding.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./useAuth";
import { usePreferences } from "../../settings/hooks/usePreferences";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences } = usePreferences();
  const [isChecking] = useState(false);

  const checkOnboardingStatus = useCallback(() => {
    if (!user) return false;
    
    // Si el usuario no tiene preferencias, necesita onboarding
    if (!preferences) {
      navigate('/onboarding');
      return true;
    }
    
    return false;
  }, [user, preferences, navigate]);

  const completeOnboarding = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return {
    isChecking,
    checkOnboardingStatus,
    completeOnboarding,
    needsOnboarding: !preferences && !!user
  };
};