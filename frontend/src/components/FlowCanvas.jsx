// src/components/FlowCanvas.jsx
import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import all node types
import * as nodeComponents from './nodes';

const FlowCanvas = ({
  nodes,
  edges,
  nodeData,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  // Register all custom node types
  const nodeTypes = useMemo(() => {
    // Convert from the imported modules to the format ReactFlow expects
    return Object.entries(nodeComponents).reduce((types, [name, Component]) => {
      // Convert PascalCase to lowercase for node type keys
      const typeKey = name.replace(/([A-Z])/g, c => c.toLowerCase());
      return {
        ...types,
        [typeKey]: Component,
      };
    }, {});
  }, []);

  // Enhance nodes with their data
  const enhancedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        ...nodeData[node.id],
      },
    }));
  }, [nodes, nodeData]);

  return (
    <ReactFlow
      nodes={enhancedNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};

export default FlowCanvas;