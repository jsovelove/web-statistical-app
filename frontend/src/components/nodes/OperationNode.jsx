// src/components/nodes/OperationNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import statisticsApi from '../../api/StatisticsApi';
import useApiRequest from '../../hooks/useApiRequest';

const OperationNode = ({ data, isConnectable }) => {
  const [operation, setOperation] = useState('add');
  const [value, setValue] = useState(0);
  const inputData = data.inputs?.input || [];
  
  // Use our custom hook to handle the API request
  const { data: apiData, loading, error, execute } = useApiRequest(
    () => statisticsApi.applyOperation(inputData, operation, value),
    [inputData, operation, value],
    {
      initialData: { result: [] },
      autoExecute: inputData.length > 0,
      debounceMs: 300,
    }
  );
  
  // Extract result data
  const resultData = apiData?.result || [];
  
  // Update the node's output data when the result changes
  useEffect(() => {
    if (resultData.length > 0) {
      data.onChange(resultData);
    }
  }, [resultData, data]);
  
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
    <div className="bg-white border-2 border-red-300 rounded-md p-2 shadow-md">
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
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
        />
      </div>
      
      {loading ? (
        <div className="text-xs text-gray-500 italic">Processing...</div>
      ) : error ? (
        <div className="text-xs text-red-500">Error: {error}</div>
      ) : (
        <div className="text-xs">
          <div><span className="font-semibold">Operation:</span> {getOperationDisplayName(operation)} by {value}</div>
          <div><span className="font-semibold">Items:</span> {resultData.length}</div>
          {resultData.length > 0 && (
            <div>
              <span className="font-semibold">Sample:</span> {resultData.slice(0, 3).map(v => v.toFixed(2)).join(', ')}
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