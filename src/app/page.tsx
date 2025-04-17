
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const ImageGenerator = () => {
  const [data, setData] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const handleDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(event.target.value);
  };

  const generateImages = async () => {
    // Placeholder for data parsing and image generation logic
    // This should parse the data, compute colors based on data relations, and generate images
    // For now, let's simulate image generation with placeholder images
    const numberOfImages = 3;
    const placeholderImages = Array.from({ length: numberOfImages }, (_, index) =>
      `https://picsum.photos/200/200?random=${index}`
    );
    setImages(placeholderImages);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await file.text();
        setData(fileContent);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const downloadImage = (imageUrl: string) => {
    // Placeholder for image download logic
    console.log('Downloading image:', imageUrl);
  };

  const downloadAllImages = () => {
    // Placeholder for ZIP archive download logic
    console.log('Downloading all images as ZIP');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>DataVision Images</CardTitle>
          <CardDescription>Upload data and generate images based on data relations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-foreground">
              Upload Data (CSV, JSON)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Choose a file
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="data-input" className="block text-sm font-medium text-foreground">
              Data Input
            </label>
            <div className="mt-1">
              <Textarea
                id="data-input"
                rows={4}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                value={data}
                onChange={handleDataChange}
              />
            </div>
          </div>
          <Button onClick={generateImages}>Generate Images</Button>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-medium text-foreground">Generated Images</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img src={imageUrl} alt={`Generated Image ${index}`} className="rounded-md shadow-md" />
                <Button
                  onClick={() => downloadImage(imageUrl)}
                  className="absolute top-2 right-2 bg-secondary text-foreground hover:bg-accent text-sm"
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={downloadAllImages} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/80">
            Download All as ZIP
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
