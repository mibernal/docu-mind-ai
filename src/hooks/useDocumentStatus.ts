// hooks/useDocumentStatus.ts - VERSIÓN CORREGIDA
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';

export const useDocumentStatus = (documentId: string | undefined) => {
  const [status, setStatus] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);

  const refetch = async () => {
    if (!documentId) return;
    
    try {
      setIsProcessing(true);
      const response = await apiClient.getDocumentStatus(documentId);
      if (isMounted.current) {
        setStatus(response);
      }
    } catch (error) {
      console.error('Error fetching document status:', error);
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    
    if (documentId) {
      // Polling cada 10 segundos (no más frecuente)
      intervalRef.current = setInterval(refetch, 10000);
      // Primera llamada
      refetch();
    }

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [documentId]);

  return { status, isProcessing, refetch };
};