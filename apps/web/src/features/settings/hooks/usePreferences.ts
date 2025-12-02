// apps/web/src/features/settings/hooks/usePreferences.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { UserPreferences, CustomField } from '@/types';

const BASE_PATH = '/users/preferences';

export const usePreferences = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // Obtener preferencias del usuario
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get(`${BASE_PATH}`);
      setPreferences(data.preferences);
      setCustomFields(data.customFields || []);
      setTemplates(data.templates || []);
      return data;
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load preferences');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registrar/guardar preferencias (onboarding)
  const setUserPreferences = useCallback(async (preferencesData: any) => {
    try {
      setIsLoading(true);
      const data = await apiClient.post(`${BASE_PATH}/onboarding`, preferencesData);
      setPreferences(data.preferences);
      toast.success('Preferences saved successfully');
      return data;
    } catch (error) {
      console.error('Failed to set preferences:', error);
      toast.error('Failed to save preferences');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar preferencias
  const updateUserPreferences = useCallback(async (preferencesData: any) => {
    try {
      setIsLoading(true);
      const data = await apiClient.put(`${BASE_PATH}`, preferencesData);
      setPreferences(data.preferences);
      toast.success('Preferences updated successfully');
      return data;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar un campo personalizado
  const addCustomField = useCallback(async (field: Omit<CustomField, 'id'>) => {
    try {
      setIsLoading(true);
      const data = await apiClient.post(`${BASE_PATH}/custom-fields`, field);
      setCustomFields(prev => [...prev, data.customField]);
      toast.success('Custom field added successfully');
      return data;
    } catch (error) {
      console.error('Failed to add custom field:', error);
      toast.error('Failed to add custom field');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar un campo personalizado
  const deleteCustomField = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await apiClient.delete(`${BASE_PATH}/custom-fields/${id}`);
      setCustomFields(prev => prev.filter(field => field.id !== id));
      toast.success('Custom field deleted successfully');
    } catch (error) {
      console.error('Failed to delete custom field:', error);
      toast.error('Failed to delete custom field');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener plantillas predefinidas
  const getPredefinedTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get(`${BASE_PATH}/templates/predefined`);
      return data.predefinedTemplates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    preferences,
    customFields,
    templates,
    fetchPreferences,
    setUserPreferences,
    updateUserPreferences,
    addCustomField,
    deleteCustomField,
    getPredefinedTemplates,
  };
};
