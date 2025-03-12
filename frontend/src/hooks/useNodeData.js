// src/hooks/useNodeData.js
import { useState, useCallback, useMemo } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge 
} from '@xyflow/react';
import { useDataFlow } from './useDataFlow';

export const useNodeData = () => {
  // State for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Store node data separately to manage data flow
  const [nodeData, setNodeData] = useState({});
  
  // Update data for a specific node
  const updateNodeData = useCallback((nodeId, data) => {
    setNodeData(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        value: data
      }
    }));
  }, []);
  
  // Use our data flow hook to manage connections between nodes
  useDataFlow({
    nodes,
    edges,
    nodeData,
    setNodeData,
  });
  
  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge(params, eds));
  }, [setEdges]);
  
  // Add a new node to the graph
  const addNode = useCallback((type) => {
    const nodeId = `node_${type}_${Date.now()}`;
    const newNode = {
      id: nodeId,
      type,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {
        onChange: (data) => updateNodeData(nodeId, data),
      },
    };
    
    setNodes(nds => [...nds, newNode]);
    
    // Initialize node data
    setNodeData(prev => ({
      ...prev,
      [nodeId]: { 
        value: type === 'input' ? [1, 2, 3, 4, 5] : [],
        // For tracking inputs that come from connections
        inputs: {}
      }
    }));
  }, [setNodes, updateNodeData]);

  return {
    nodes,
    edges,
    nodeData,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
  };
};