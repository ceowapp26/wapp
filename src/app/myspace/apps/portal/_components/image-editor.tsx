"use client"
import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Crop, RotateCcw, Download, Upload, Layers, Sun, Contrast, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider as SliderComponent } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImageEditor = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [cropMode, setCropMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setEditedImageUrl(url);
  };

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setEditedImageUrl(canvas.toDataURL('image/jpeg'));
    };
    img.src = imageUrl;
  };

  const handleCrop = () => {
    setCropMode(!cropMode);
    // Implement cropping logic here
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImageUrl;
    link.download = 'edited_image.jpg';
    link.click();
  };

  const handleReset = () => {
    setEditedImageUrl(imageUrl);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
  };

  useEffect(() => {
    if (imageUrl) {
      applyFilters();
    }
  }, [brightness, contrast, saturation, rotation]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Professional Image Editor</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              {!editedImageUrl && 
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mb-4 dark:text-white">
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Image</DialogTitle>
                    </DialogHeader>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                  </DialogContent>
                </Dialog>
              }
              {editedImageUrl && (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img src={editedImageUrl} alt="Edited" className="w-full h-auto" />
                  {cropMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-50">
                      {/* Add cropping UI here */}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <Tabs defaultValue="adjust">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="adjust"><SlidersHorizontal className="mr-2 h-4 w-4" /> Adjust</TabsTrigger>
                  <TabsTrigger value="filters"><Layers className="mr-2 h-4 w-4" /> Filters</TabsTrigger>
                  <TabsTrigger value="crop"><Crop className="mr-2 h-4 w-4" /> Crop</TabsTrigger>
                </TabsList>
                <TabsContent value="adjust">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brightness</label>
                      <SliderComponent
                        value={[brightness]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setBrightness(value[0])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contrast</label>
                      <SliderComponent
                        value={[contrast]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setContrast(value[0])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Saturation</label>
                      <SliderComponent
                        value={[saturation]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setSaturation(value[0])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                      <SliderComponent
                        value={[rotation]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(value) => setRotation(value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="filters">
                  <div className="grid grid-cols-3 gap-4">
                    <Button onClick={() => applyFilters('sepia')} className="w-full">Sepia</Button>
                    <Button onClick={() => applyFilters('grayscale')} className="w-full">Grayscale</Button>
                    <Button onClick={() => applyFilters('invert')} className="w-full">Invert</Button>
                    {/* Add more filter buttons */}
                  </div>
                </TabsContent>
                <TabsContent value="crop">
                  <Button onClick={handleCrop} className="w-full">
                    {cropMode ? 'Apply Crop' : 'Start Cropping'}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button className="dark:text-white" onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </motion.div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageEditor;