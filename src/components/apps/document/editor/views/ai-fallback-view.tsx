import React from 'react';

export const AIFallbackView: React.FC = ({ data }) => {
  return (
    <React.Fragment>
      <h1 className="text-xl font-bold text-center text-blue-600 py-10 max-h-[350px] overflow-auto">{data}</h1>
    </React.Fragment>
  );
}
