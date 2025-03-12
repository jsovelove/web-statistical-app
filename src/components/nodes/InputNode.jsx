// src/components/nodes/InputNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

const InputNode = ({ data, isConnectable }) => {
  const [textValue, setTextValue] = useState('1, 2, 3, 4, 5');
  const [values, setValues] = useState([1, 2, 3, 4, 5]);

  // Parse input text to array of numbers
  const parseInput = (text) => {
    try {
      // Clean the text and allow only numbers, dots, commas, minus, and whitespace
      const cleanText = text.replace(/[^\d.,\s-]/g, '');
      // Split by commas or whitespace
      const parts = cleanText.split(/[\s,]+/);
      // Convert to numbers and filter out NaN
      return parts
        .map(part => parseFloat(part.trim()))
        .filter(num => !isNaN(num));
    } catch (e) {
      console.error('Error parsing input:', e);
      return [];
    }
  };

  // Update output data when text changes
  useEffect(() => {
    const parsedValues = parseInput(textValue);
    setValues(parsedValues);
    data.onChange(parsedValues);
  }, [textValue, data]);

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  // Generate random data
  const generateRandomData = () => {
    const count = Math.floor(Math.random() * 10) + 5; // 5-15 random numbers
    const randomValues = Array.from({ length: count }, () => 
      Math.floor(Math.random() * 100)
    );
    setTextValue(randomValues.join(', '));
  };

  return (
    <div className="bg-white border-2 border-blue-300 rounded-md p-2 shadow-md w-48">
      <div className="font-bold text-sm mb-2">Input Data</div>
      
      <div className="mb-2">
        <textarea
          className="w-full p-1 border border-gray-300 rounded text-xs"
          rows="3"
          value={textValue}
          onChange={handleTextChange}
          placeholder="Enter comma-separated numbers"
        />
      </div>
      
      <div className="flex justify-between text-xs mb-2">
        <div>
          <span className="font-semibold">Values:</span> {values.length}
        </div>
        <button
          className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs"
          onClick={generateRandomData}
        >
          Random
        </button>
      </div>
      
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

export default InputNode;