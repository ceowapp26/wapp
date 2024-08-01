import React from 'react';

interface AIImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
}

const AIImageNode: React.FC<AIImageProps> = ({ url, ...rest }) => {
  return (
    <img 
      src={url}
      {...rest}
    />
  );
}

export default AIImageNode;
