import React from 'react';

// Define node types with their display information
const NODE_TYPES = [
  { id: 'input', label: 'Input', color: 'blue' },
  { id: 'stats', label: 'Stats', color: 'green' },
  { id: 'histogram', label: 'Histogram', color: 'purple' },
  { id: 'filter', label: 'Filter', color: 'yellow' },
  { id: 'operation', label: 'Operation', color: 'red' },
  { id: 'display', label: 'Display', color: 'blue' },
];

const NodeToolbar = ({ addNode }) => {
  return (
    <div className="p-2 border-b flex items-center">
      <div className="font-bold text-lg mr-4">Statistical Flow</div>
      <div className="flex space-x-1 flex-wrap">
        {NODE_TYPES.map((type) => (
          <button
            key={type.id}
            className={`px-2 py-1 bg-${type.color}-500 text-white rounded text-xs`}
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