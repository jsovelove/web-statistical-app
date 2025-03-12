// src/components/nodes/FilterNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import statisticsService from '../../services/statisticsService';

const FilterNode = ({ data, isConnectable }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputData = data.inputs?.input || [];
  const [filteredData, setFilteredData] = useState([]);
  
  // Apply filter when inputs change
  useEffect(() => {
    const applyFilter = () => {
      if (!inputData.length) {
        setFilteredData([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Convert empty strings to null for the filter function
        const minVal = min === '' ? null : parseFloat(min);
        const maxVal = max === '' ? null : parseFloat(max);
        
        // Use client-side service to filter data
        const result = statisticsService.filterData(
          inputData, 
          minVal,
          maxVal
        );
        
        setFilteredData(result.filtered_data || []);
        
        // Pass filtered data to downstream nodes
        data.onChange(result.filtered_data || []);
      } catch (err) {
        console.error('Error filtering data:', err);
        setError('Failed to filter data');
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilter();
  }, [inputData, min, max, data]);

  return (
    <div className="bg-white border-2 border-yellow-300 rounded-md p-2 shadow-md w-48">
      <div className="font-bold text-sm mb-2">Filter</div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div>
          <label className="text-xs">Min</label>
          <input
            type="number"
            className="w-full p-1 border border-gray-300 rounded text-xs"
            placeholder="Min value"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs">Max</label>
          <input
            type="number"
            className="w-full p-1 border border-gray-300 rounded text-xs"
            placeholder="Max value"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-xs text-gray-500 italic">Filtering...</div>
      ) : error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : (
        <div className="text-xs">
          <div><span className="font-semibold">Original:</span> {inputData.length} items</div>
          <div><span className="font-semibold">Filtered:</span> {filteredData.length} items</div>
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

export default FilterNode;