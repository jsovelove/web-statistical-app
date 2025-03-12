// src/api/apiConfig.js

/**
 * API configuration for the statistical flow application
 */
const API_CONFIG = {
    // Base URL for API requests
    baseUrl: 'http://localhost:8000/api',
    
    // Timeout for requests in milliseconds
    requestTimeout: 10000,
    
    // Endpoints for various statistical operations
    endpoints: {
      basicStats: '/stats/basic',
      histogram: '/stats/histogram',
      filter: '/stats/filter',
      operation: '/stats/operation',
      regression: '/stats/regression',
      correlation: '/stats/correlation',
    },
    
    // Default request options
    defaultOptions: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
  
  export default API_CONFIG;