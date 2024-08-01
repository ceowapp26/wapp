import React, { useState } from 'react';

const ImageEditor = () => {
  const [imageUrl, setImageUrl] = useState('');
  const canvasRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleResize = (width, height) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setImageUrl(canvas.toDataURL('image/jpeg'));
    };
    img.src = imageUrl;
  };

  const handleApplyEffect = (effect) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      switch (effect) {
        case 'grayscale':
          ctx.filter = 'grayscale(100%)';
          break;
        case 'sepia':
          ctx.filter = 'sepia(100%)';
          break;
        // Add more effects as needed
        default:
          ctx.filter = 'none';
          break;
      }
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setImageUrl(canvas.toDataURL('image/jpeg'));
    };
    img.src = imageUrl;
  };

  const effectsList = [
    { name: 'Grayscale', effect: 'grayscale' },
    { name: 'Sepia', effect: 'sepia' },
  ];

  return (
    <div>
      <h2 className="font-bold text-xl text-black py-4">Image Editor</h2>
      <input type="file" accept="image/*" className="border p-2" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
          <div className="mt-4">
            <button onClick={() => handleResize(800, 600)} className="mr-4 bg-blue-500 text-white p-2">
              Resize to 800x600
            </button>
            {effectsList.map((effect, index) => (
              <button key={index} onClick={() => handleApplyEffect(effect.effect)} className="mr-4 bg-gray-500 text-white p-2">
                Apply {effect.name} Effect
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
