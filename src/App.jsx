// src/App.jsx
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowCanvas from './components/FlowCanvas';
import NodeToolbar from './components/NodeToolbar';
import { useNodeData } from './hooks/useNodeData';

const App = () => {
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
      <ReactFlowProvider>
        <NodeToolbar addNode={addNode} />
        <div className="flex-grow w-full" style={{ height: 'calc(100vh - 50px)' }}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            nodeData={nodeData}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default App;