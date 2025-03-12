// src/components/NodeToolbar.jsx
import React from 'react';

// Define node types with their display information
const NODE_TYPES = [
  { id: 'inputnode', label: 'Input', color: 'blue' },
  { id: 'statsnode', label: 'Stats', color: 'green' },
  { id: 'histogramnode', label: 'Histogram', color: 'purple' },
  { id: 'filternode', label: 'Filter', color: 'yellow' },
  { id: 'operationnode', label: 'Operation', color: 'red' },
  { id: 'datadisplaynode', label: 'Display', color: 'blue' },
];

const NodeToolbar = ({ addNode }) => {
  return (
    <div className="p-2 border-b flex items-center bg-white shadow-sm">
      <div className="font-bold text-lg mr-4">Statistical Flow</div>
      <div className="flex space-x-1 flex-wrap">
        {NODE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`px-2 py-1 bg-${type.color}-500 hover:bg-${type.color}-600 text-white rounded text-xs transition-colors`}
            onClick={() => addNode(type.id)}
          >
            + {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodeToolbar;