import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button style={{
      padding: '0.75rem 2rem',
      borderRadius: '30px',
      background: '#61dafb',
      color: '#282c34',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }} {...props}>
      {children}
    </button>
  );
}
