'use client';
import { computePlotData, DataRecord } from '../utils/computePlotData';
import {Canvg, presets} from 'canvg';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';


const ImageGenerator = () => {
  const [data, setData] = useState<string>('');
  const [images, setImages] = useState<JSX.Element[]>([]);
  const [parsedData, setParsedData] = useState<DataRecord[]>([]);

  const handleDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(event.target.value);
  };

  const parseData = (dataString: string): DataRecord[] => {
    const lines = dataString.trim().split('\n');
    const parsedRecords: DataRecord[] = [];

    for (const line of lines) {
      const values = line.split(';');
      if (values.length === 7) {
        const [timestamp, mm, punto1, punto2, punto3, punto4, punto5] = values;

        const record: DataRecord = {
          timestamp: timestamp,
          mm: mm.toLowerCase() === 'true',
          punto1: parseFloat(punto1),
          punto2: parseFloat(punto2),
          punto3: parseFloat(punto3),
          punto4: parseFloat(punto4),
          punto5: parseFloat(punto5),
        };
        parsedRecords.push(record);
      }
    }
    return parsedRecords;
  };

  useEffect(() => {
    if (data) {
      setParsedData(parseData(data));
    }
  }, [data]);

// buildPointPlot ora usa computePlotData importata
//
const buildPointPlot = async () => {
  const imageSize = 320;
  const newImages = parsedData.map((record, index) => {
    const plotData = computePlotData(record, imageSize);

    const path = `M ${plotData.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    return (
      <svg width={imageSize} height={imageSize} key={index} data-svg-name={String(plotData.timestamp)}>
        <rect width="100%" height="100%" fill={plotData.backgroundColor} />
        <path d={path} stroke="black" strokeWidth="2" fill="none" />
        {plotData.points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="black" />
        ))}
      </svg>
    );
  });
  setImages(newImages);
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

  const downloadImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const svgDiv = button.parentElement;
    const svgElement = svgDiv?.querySelector('svg');
    const imageName = svgElement?.getAttribute('data-svg-name');

    if (svgElement && imageName) {      
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;
        const ctx = canvas.getContext('2d');
        //const preset = presets.node();

        if (ctx) {
          const v = Canvg.fromString(ctx, svgString);

          v.render().then(() => {
            const pngDataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngDataUrl;
            downloadLink.download = `${imageName}.png`;
            downloadLink.click();
          });
        } else {
          console.error('Failed to get 2D context');
        }
      } else {
        console.error('SVG element or image name attribute not found');
      }
  };

  const downloadAllImages = () => {
    // Placeholder for ZIP archive download logic
    console.log('Downloading all images as ZIP');
  };

  const handleReset = () => {
    setData('');
    setImages([]);
    setParsedData([]);
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
          <div className="flex">
            <Button onClick={buildPointPlot} className="mr-2">Point Plot</Button>
            <Button onClick={handleReset} variant="secondary">Reset</Button>
          </div>
        </CardContent>
      </Card>

      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-medium text-foreground">Generated Images</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((svgImage, index) => (
              <div key={index} className="relative">
                {svgImage}
                <Button
                  onClick={downloadImage}
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
