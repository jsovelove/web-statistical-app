// src/hooks/useDataFlow.js
import { useEffect } from 'react';

export const useDataFlow = ({ nodes, edges, nodeData, setNodeData }) => {
  // Process connections to flow data between nodes
  useEffect(() => {
    // Create a copy of the current nodeData
    const newNodeData = { ...nodeData };
    
    // Process edges to determine data flow
    edges.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sourceData = newNodeData[sourceNode.id]?.value || [];
      
      // Update inputs for the target node
      newNodeData[targetNode.id] = {
        ...newNodeData[targetNode.id],
        inputs: {
          ...newNodeData[targetNode.id]?.inputs,
          [edge.targetHandle || 'input']: sourceData
        }
      };
    });
    
    setNodeData(newNodeData);
  }, [edges, nodes, nodeData, setNodeData]);
};