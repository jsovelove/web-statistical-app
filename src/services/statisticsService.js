// src/services/statisticsService.js
import * as math from 'mathjs';

/**
 * Client-side implementation of statistical functions using mathjs
 * Replaces the need for a Python backend
 */
class StatisticsService {
  /**
   * Calculate basic statistics for an array of numbers
   * @param {Array<number>} data - Array of numbers
   * @returns {Object} - Statistical measures
   */
  calculateBasicStats(data) {
    if (!data || data.length === 0) {
      return {
        mean: "N/A",
        median: "N/A",
        std_dev: "N/A",
        count: 0,
        min: "N/A",
        max: "N/A",
        quartiles: ["N/A", "N/A", "N/A"]
      };
    }

    try {
      return {
        mean: math.mean(data),
        median: math.median(data),
        std_dev: math.std(data, 'uncorrected'),
        count: data.length,
        min: math.min(data),
        max: math.max(data),
        quartiles: [
          math.quantileSeq(data, 0.25),
          math.quantileSeq(data, 0.5),
          math.quantileSeq(data, 0.75)
        ]
      };
    } catch (error) {
      console.error("Error calculating statistics:", error);
      return {
        mean: "Error",
        median: "Error",
        std_dev: "Error",
        count: data.length,
        min: "Error",
        max: "Error",
        quartiles: ["Error", "Error", "Error"],
        error: error.message
      };
    }
  }

  /**
   * Generate histogram data
   * @param {Array<number>} data - Array of numbers
   * @param {number} bins - Number of bins
   * @returns {Array} - Histogram data
   */
  generateHistogram(data, bins = 5) {
    if (!data || data.length < 2) {
      return [];
    }
    
    try {
      const min = math.min(data);
      const max = math.max(data);
      const binWidth = (max - min) / bins;
      
      // Initialize bin objects
      const histogramData = [];
      for (let i = 0; i < bins; i++) {
        const binStart = min + (i * binWidth);
        const binEnd = min + ((i + 1) * binWidth);
        histogramData.push({
          range: `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`,
          count: 0
        });
      }
      
      // Count items in each bin
      data.forEach(value => {
        // Special case for the maximum value
        if (value === max) {
          histogramData[bins - 1].count++;
          return;
        }
        
        const binIndex = Math.floor((value - min) / binWidth);
        // Make sure binIndex is valid (should always be, but just in case)
        if (binIndex >= 0 && binIndex < bins) {
          histogramData[binIndex].count++;
        }
      });
      
      return histogramData;
    } catch (error) {
      console.error("Error generating histogram:", error);
      return [];
    }
  }

  /**
   * Filter data based on min and max constraints
   * @param {Array<number>} data - Array of numbers
   * @param {number|null} minValue - Minimum value (inclusive)
   * @param {number|null} maxValue - Maximum value (inclusive)
   * @returns {Object} - Object containing filtered data
   */
  filterData(data, minValue = null, maxValue = null) {
    if (!data || data.length === 0) {
      return { filtered_data: [] };
    }
    
    try {
      let filteredData = [...data];
      
      if (minValue !== null) {
        filteredData = filteredData.filter(value => value >= minValue);
      }
      
      if (maxValue !== null) {
        filteredData = filteredData.filter(value => value <= maxValue);
      }
      
      return { filtered_data: filteredData };
    } catch (error) {
      console.error("Error filtering data:", error);
      return { filtered_data: [], error: error.message };
    }
  }

  /**
   * Apply a mathematical operation to each value
   * @param {Array<number>} data - Array of numbers
   * @param {string} operation - Operation type: 'add', 'subtract', 'multiply', 'divide'
   * @param {number} value - Value to use in the operation
   * @returns {Object} - Object containing the result
   */
  applyOperation(data, operation, value) {
    if (!data || data.length === 0) {
      return { result: [] };
    }
    
    try {
      let result;
      switch (operation) {
        case 'add':
          result = data.map(item => math.add(item, value));
          break;
        case 'subtract':
          result = data.map(item => math.subtract(item, value));
          break;
        case 'multiply':
          result = data.map(item => math.multiply(item, value));
          break;
        case 'divide':
          if (value === 0) {
            throw new Error("Cannot divide by zero");
          }
          result = data.map(item => math.divide(item, value));
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      return { result };
    } catch (error) {
      console.error("Error applying operation:", error);
      return { result: [], error: error.message };
    }
  }

  /**
   * Perform linear regression on x,y pairs
   * @param {Array<number>} data - Array of numbers (alternating x,y values)
   * @returns {Object} - Regression results
   */
  linearRegression(data) {
    if (data.length < 4 || data.length % 2 !== 0) {
      return {
        slope: "N/A",
        intercept: "N/A",
        r_squared: "N/A",
        p_value: "N/A",
        std_error: "N/A",
        error: "Need at least two x,y pairs for regression"
      };
    }
    
    try {
      // Convert flat array to x,y pairs
      const pairs = [];
      for (let i = 0; i < data.length; i += 2) {
        pairs.push([data[i], data[i + 1]]);
      }
      
      // Extract x and y arrays
      const x = pairs.map(pair => pair[0]);
      const y = pairs.map(pair => pair[1]);
      
      // Get regression equation using mathjs
      const result = math.linearRegression(x, y);
      const equation = result.equation;
      
      // Extract slope and intercept
      const slope = equation[0];
      const intercept = equation[1];
      
      // Calculate predicted values
      const yPredicted = x.map(xi => slope * xi + intercept);
      
      // Calculate R-squared
      const yMean = math.mean(y);
      const ssTotal = math.sum(y.map(yi => math.pow(yi - yMean, 2)));
      const ssResidual = math.sum(y.map((yi, i) => math.pow(yi - yPredicted[i], 2)));
      const rSquared = 1 - (ssResidual / ssTotal);
      
      // Calculate standard error and p-value
      const n = x.length;
      const df = n - 2;
      const stdError = math.sqrt(ssResidual / df) / math.sqrt(math.sum(x.map(xi => math.pow(xi - math.mean(x), 2))));
      
      // Calculate p-value using t-distribution (approximation)
      const tStat = slope / stdError;
      const pValue = 2 * (1 - this._tCDF(math.abs(tStat), df));
      
      return {
        slope,
        intercept,
        r_squared: rSquared,
        p_value: pValue,
        std_error: stdError
      };
    } catch (error) {
      console.error("Error performing regression:", error);
      return {
        slope: "Error",
        intercept: "Error",
        r_squared: "Error",
        p_value: "Error",
        std_error: "Error",
        error: error.message
      };
    }
  }

  /**
   * Calculate correlation between pairs of values
   * @param {Array<number>} data - Array of numbers (alternating x,y values)
   * @returns {Object} - Correlation results
   */
  calculateCorrelation(data) {
    if (data.length < 4 || data.length % 2 !== 0) {
      return {
        correlation: "N/A",
        p_value: "N/A",
        error: "Need at least two x,y pairs"
      };
    }
    
    try {
      // Convert flat array to x,y pairs
      const pairs = [];
      for (let i = 0; i < data.length; i += 2) {
        pairs.push([data[i], data[i + 1]]);
      }
      
      // Extract x and y arrays
      const x = pairs.map(pair => pair[0]);
      const y = pairs.map(pair => pair[1]);
      
      // Calculate correlation coefficient
      const correlation = math.correlation(x, y);
      
      // Calculate p-value
      const n = x.length;
      const df = n - 2;
      const tStat = correlation * math.sqrt(df / ((1 - correlation) * (1 + correlation)));
      const pValue = 2 * (1 - this._tCDF(math.abs(tStat), df));
      
      return {
        correlation,
        p_value: pValue
      };
    } catch (error) {
      console.error("Error calculating correlation:", error);
      return {
        correlation: "Error",
        p_value: "Error",
        error: error.message
      };
    }
  }

  /**
   * Helper method: Approximate CDF of Student's t-distribution
   * @private
   */
  _tCDF(t, df) {
    // This is a simple approximation of the t-distribution CDF
    if (df <= 0) {
      throw new Error("Degrees of freedom must be positive");
    }
    
    // For large df, approximate with normal distribution
    if (df > 30) {
      return this._normalCDF(t);
    }
    
    // Beta function approximation for Student's t CDF
    const x = df / (df + t * t);
    const A = 0.5;
    const B = df / 2;
    let betaIncomplete;
    
    try {
      // Use mathjs beta function
      betaIncomplete = math.beta(A, B) * math.pow(x, A);
      return 1 - 0.5 * betaIncomplete;
    } catch {
      // Fallback to normal approximation if beta function fails
      return this._normalCDF(t);
    }
  }

  /**
   * Helper method: Normal cumulative distribution function
   * @private
   */
  _normalCDF(z) {
    return 0.5 * (1 + math.erf(z / math.sqrt(2)));
  }
}

// Create and export a singleton instance
const statisticsService = new StatisticsService();
export default statisticsService;