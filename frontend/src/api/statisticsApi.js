// src/api/statisticsApi.js
import API_CONFIG from './apiConfig';

/**
 * Client for the Python Statistics API
 * Handles all communication with the Flask backend
 */
class StatisticsApi {
  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.endpoints = config.endpoints;
    this.defaultOptions = config.defaultOptions;
    this.requestTimeout = config.requestTimeout;
  }

  /**
   * Helper method to make API calls with timeout
   */
  async _callApi(endpoint, data) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.defaultOptions.headers,
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      console.error(`Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Calculate basic statistics for an array of numbers
   */
  async calculateBasicStats(data) {
    return this._callApi(this.endpoints.basicStats, { data });
  }

  /**
   * Generate histogram data
   */
  async generateHistogram(data, bins = 5) {
    return this._callApi(this.endpoints.histogram, { data, bins });
  }

  /**
   * Filter data based on min and max constraints
   */
  async filterData(data, minValue = null, maxValue = null) {
    return this._callApi(this.endpoints.filter, { 
      data, 
      min_value: minValue, 
      max_value: maxValue 
    });
  }

  /**
   * Apply an operation to each value in the data
   */
  async applyOperation(data, operation, value) {
    return this._callApi(this.endpoints.operation, { 
      data, 
      operation, 
      value: parseFloat(value) 
    });
  }

  /**
   * Perform linear regression on x,y pairs
   */
  async linearRegression(data) {
    return this._callApi(this.endpoints.regression, { data });
  }
  
  /**
   * Calculate correlation between x,y pairs
   */
  async calculateCorrelation(data) {
    return this._callApi(this.endpoints.correlation, { data });
  }
}

// Create and export a singleton instance
const statisticsApi = new StatisticsApi();
export default statisticsApi;