// src/components/nodes/StatsNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import statisticsApi from '../../api/apiConfig';

const StatsNode = ({ data, isConnectable }) => {
  const inputData = data.inputs?.input || [];
  const [stats, setStats] = useState({ 
    mean: 'N/A', 
    median: 'N/A', 
    std_dev: 'N/A', 
    count: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch statistics from Python backend when input data changes
  useEffect(() => {
    const fetchStats = async () => {
      // Don't make API call if no data
      if (!inputData.length) {
        setStats({ mean: 'N/A', median: 'N/A', std_dev: 'N/A', count: 0 });
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await statisticsApi.calculateBasicStats(inputData);
        setStats(result);
        
        // Make the output data available to downstream nodes
        data.onChange(inputData);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to calculate statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [inputData, data]);

  return (
    <div className="bg-white border-2 border-green-300 rounded-md p-2 shadow-md">
      <div className="font-bold text-sm mb-2">Basic Statistics</div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      {loading ? (
        <div className="text-xs text-gray-500 italic">Loading...</div>
      ) : error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : (
        <div className="text-xs">
          <div><span className="font-semibold">Count:</span> {stats.count}</div>
          <div><span className="font-semibold">Mean:</span> {typeof stats.mean === 'number' ? stats.mean.toFixed(2) : stats.mean}</div>
          <div><span className="font-semibold">Median:</span> {typeof stats.median === 'number' ? stats.median.toFixed(2) : stats.median}</div>
          <div><span className="font-semibold">St. Dev:</span> {typeof stats.std_dev === 'number' ? stats.std_dev.toFixed(2) : stats.std_dev}</div>
          
          {/* Additional statistics from Python backend */}
          {stats.min !== undefined && (
            <div><span className="font-semibold">Min:</span> {stats.min.toFixed(2)}</div>
          )}
          {stats.max !== undefined && (
            <div><span className="font-semibold">Max:</span> {stats.max.toFixed(2)}</div>
          )}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default StatsNode;