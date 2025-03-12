// src/components/nodes/OperationNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import statisticsService from '../../services/statisticsService';

const OperationNode = ({ data, isConnectable }) => {
  const [operation, setOperation] = useState('add');
  const [value, setValue] = useState(0);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const inputData = data.inputs?.input || [];
  
  // Apply operation when inputs change
  useEffect(() => {
    const applyOperation = () => {
      if (!inputData.length) {
        setResultData([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Use client-side service to apply operation
        const result = statisticsService.applyOperation(
          inputData,
          operation,
          parseFloat(value) || 0
        );
        
        setResultData(result.result || []);
        
        // Pass result data to downstream nodes
        data.onChange(result.result || []);
      } catch (err) {
        console.error('Error applying operation:', err);
        setError(err.message || 'Operation failed');
        setResultData([]);
      } finally {
        setLoading(false);
      }
    };
    
    applyOperation();
  }, [inputData, operation, value, data]);
  
  // Get operation display name
  const getOperationDisplayName = (op) => {
    switch (op) {
      case 'add': return 'Add';
      case 'subtract': return 'Subtract';
      case 'multiply': return 'Multiply';
      case 'divide': return 'Divide';
      default: return op;
    }
  };

  return (
    <div className="bg-white border-2 border-red-300 rounded-md p-2 shadow-md w-48">
      <div className="font-bold text-sm mb-2">Math Operation</div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="grid grid-cols-2 gap-1 mb-2">
        <select
          className="p-1 border border-gray-300 rounded text-xs"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
        <input
          type="number"
          className="p-1 border border-gray-300 rounded text-xs"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-xs text-gray-500 italic">Processing...</div>
      ) : error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : (
        <div className="text-xs">
          <div><span className="font-semibold">Operation:</span> {getOperationDisplayName(operation)} by {value}</div>
          <div><span className="font-semibold">Items:</span> {resultData.length}</div>
          {resultData.length > 0 && (
            <div>
              <span className="font-semibold">Sample:</span> {resultData.slice(0, 3).map(v => typeof v === 'number' ? v.toFixed(2) : v).join(', ')}
              {resultData.length > 3 && '...'}
            </div>
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

export default OperationNode;