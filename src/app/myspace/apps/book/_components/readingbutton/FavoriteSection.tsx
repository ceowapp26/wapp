import React from 'react';
import FavoriteResult from './FavoriteResult';

const FavoriteSection = () => {
  return (
    <section id="view" className="results" style={{ position: 'relative', width: '500px', height: '500px' }}>
      <FavoriteResult />
    </section>
  );
};

export default FavoriteSection;
