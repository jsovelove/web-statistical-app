// src/hooks/useApiRequest.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling API requests with loading and error states
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies that trigger the API call when changed
 * @param {Object} options - Additional options
 * @returns {Object} - { data, loading, error, execute }
 */
export const useApiRequest = (apiFunction, dependencies = [], options = {}) => {
  const { 
    initialData = null,
    autoExecute = true,
    onSuccess = null,
    onError = null,
    debounceMs = 0
  } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  
  // Function to execute the API call
  const execute = useCallback(async (...args) => {
    // Clear any existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Set up new debounced call
    const debouncedCall = () => {
      setLoading(true);
      setError(null);
      
      apiFunction(...args)
        .then(result => {
          setData(result);
          if (onSuccess) onSuccess(result);
        })
        .catch(err => {
          setError(err.message || 'An error occurred');
          if (onError) onError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
    // Execute immediately or debounce
    if (debounceMs <= 0) {
      debouncedCall();
    } else {
      const timeout = setTimeout(debouncedCall, debounceMs);
      setDebounceTimeout(timeout);
    }
  }, [apiFunction, debounceMs, debounceTimeout, onSuccess, onError]);
  
  // Auto-execute when dependencies change
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [...dependencies, execute]);
  
  return { data, loading, error, execute };
};

export default useApiRequest;