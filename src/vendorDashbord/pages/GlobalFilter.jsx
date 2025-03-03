import React from 'react';

export const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div>
      <input
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value || undefined)} // Set global filter value
        placeholder={"Search all columns..."}
        style={{
          fontSize: '1.1rem',
          border: '0',
          borderBottom: '1px solid gray',
          marginBottom: '10px',
          width: '100%',
          padding: '5px',
        }}
      />
    </div>
  );
};
