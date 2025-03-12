// src/components/nodes/HistogramNode.jsx
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import statisticsApi from '../../api/StatisticsApi';
import useApiRequest from '../../hooks/useApiRequest';

const HistogramNode = ({ data, isConnectable }) => {
  const [bins, setBins] = useState(5);
  const inputData = data.inputs?.input || [];
  
  // Use our custom hook to handle the API request
  const { data: histogramData, loading, error } = useApiRequest(
    () => statisticsApi.generateHistogram(inputData, bins),
    [inputData, bins],
    {
      initialData: [],
      debounceMs: 300, // Debounce to prevent too many requests while changing bins
    }
  );
  
  // Calculate max count for scaling bars
  const maxCount = histogramData && histogramData.length > 0
    ? Math.max(...histogramData.map(b => b.count))
    : 0;
  
  return (
    <div className="bg-white border-2 border-purple-300 rounded-md p-2 shadow-md w-48">
      <div className="font-bold text-sm mb-2">Histogram</div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="mb-2">
        <label className="text-xs block mb-1">Number of Bins</label>
        <input
          type="range"
          min="2"
          max="15"
          step="1"
          value={bins}
          onChange={(e) => setBins(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="text-xs text-center">{bins}</div>
      </div>
      
      <div className="h-32">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-red-500">Error: {error}</div>
          </div>
        ) : histogramData.length > 0 ? (
          <div className="flex h-full items-end space-x-1">
            {histogramData.map((bin, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full"
                  style={{ height: `${maxCount > 0 ? (bin.count / maxCount) * 100 : 0}%` }}
                />
                <div className="text-xs truncate w-full text-center" title={bin.range}>
                  {bin.range}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            Insufficient data
          </div>
        )}
      </div>
    </div>
  );
};

export default HistogramNode;