// src/hooks/usePreferences.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { UserPreferences, CustomField, PredefinedTemplate } from '@/types';

export const usePreferences = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getUserPreferences();
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

  const setUserPreferences = useCallback(async (preferencesData: {
    useCase: string;
    customFields?: CustomField[];
    documentTypes?: string[];
  }) => {
    try {
      setIsLoading(true);
      const data = await apiClient.setUserPreferences(preferencesData);
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

  const updateUserPreferences = useCallback(async (preferencesData: {
    useCase: string;
    customFields?: CustomField[];
  }) => {
    try {
      setIsLoading(true);
      const data = await apiClient.updateUserPreferences(preferencesData);
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

  const addCustomField = useCallback(async (field: Omit<CustomField, 'id'>) => {
    try {
      setIsLoading(true);
      const data = await apiClient.addCustomField(field);
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

  const deleteCustomField = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await apiClient.deleteCustomField(id);
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

  const getPredefinedTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPredefinedTemplates();
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