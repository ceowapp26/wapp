import React from 'react';

export const KeywordDetail = ({ keyword }) => {
  return (
    <div>
      <h2>Keyword Details</h2>
      <div>
        <strong>Title:</strong> {keyword.title}
      </div>
      <div>
        <strong>Content:</strong> {keyword.content}
      </div>
    </div>
  );
};
