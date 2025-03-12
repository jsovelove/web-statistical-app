// src/components/nodes/DataDisplayNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const DataDisplayNode = ({ data, isConnectable }) => {
  const inputData = data.inputs?.input || [];
  
  // Determine display format based on data type
  const renderDataDisplay = () => {
    if (!inputData || inputData.length === 0) {
      return <div className="text-gray-400 text-xs">No data to display</div>;
    }
    
    // Sample of the data (first 10 items)
    const sample = inputData.slice(0, 10);
    
    return (
      <div className="overflow-y-auto max-h-40">
        <div className="text-xs mb-1 font-semibold">Data Sample (first 10 items):</div>
        <pre className="text-xs bg-gray-100 p-1 rounded">
          {sample.map((value, index) => (
            <div key={index}>
              {index}: {typeof value === 'number' ? value.toFixed(2) : value}
            </div>
          ))}
          {inputData.length > 10 && <div>... {inputData.length - 10} more items</div>}
        </pre>
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-blue-300 rounded-md p-2 shadow-md">
      <div className="font-bold text-sm mb-2">Data Display</div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="mb-2">
        <div className="text-xs"><span className="font-semibold">Items:</span> {inputData.length}</div>
        {renderDataDisplay()}
      </div>
    </div>
  );
};

export default DataDisplayNode;