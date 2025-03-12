import React from 'react';
import FlowCanvas from './FlowCanvas';
import NodeToolbar from './NodeToolbar';
import { useNodeData } from '../hooks/useNodeData';

const StatisticalFlowApp = () => {
  // Use our custom hook for managing node data
  const {
    nodes,
    edges,
    nodeData,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useNodeData();

  return (
    <div className="w-full h-screen flex flex-col">
      <NodeToolbar addNode={addNode} />
      <div className="flex-grow">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          nodeData={nodeData}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>
    </div>
  );
};

export default StatisticalFlowApp;