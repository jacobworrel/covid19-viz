import React from 'react';

export function Tab ({ id, name, selectedMetric, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        color: selectedMetric === id ? 'black' : 'lightgrey',
        cursor: 'pointer',
        marginRight: 20,
      }}
    >
      {name}
    </div>
  );
}