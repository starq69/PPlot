'use client';
import {Canvg, presets} from 'canvg';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

interface DataRecord {
  timestamp: string | Date;
  mm: boolean;
  punto1: number;
  punto2: number;
  punto3: number;
  punto4: number;
  punto5: number;
}

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

  const buildPointPlot = async () => {
    const imageSize = 320;
    const newImages = parsedData.map((record, index) => {
       // Determine background color
      const backgroundColor = record.punto1 > record.punto5 ? 'red' : 'green';
      /*
      const gradientId = `gradient${index}`;

      // Determine background gradient
      const backgroundGradient = record.punto1 > record.punto5
        ? `url(#${gradientId})`
        : `url(#${gradientId})`;

       // Define color stops for gradient
      const colorStops = 5;
      const gradientLevels: string[] = [];

      if (backgroundColor === 'red') {
        for (let i = 0; i < colorStops; i++) {
          // Exclude 10% of the lightest and darkest shades
          const lightness = 90 - (i * (70 / (colorStops - 1))) + 10;
          gradientLevels.push(`hsl(0, 100%, ${lightness}%)`);  // Red gradient levels
        }
      } else {
        for (let i = 0; i < colorStops; i++) {
          // Exclude 10% of the lightest and darkest shades
          const lightness = 90 - (i * (70 / (colorStops - 1))) + 10;
          gradientLevels.push(`hsl(120, 100%, ${lightness}%)`);  // Green gradient levels
        }
      }
      */

      // Find min and max values
      let minVal = record.punto1;
      let maxVal = record.punto1;
      for (const key of ['punto2', 'punto3', 'punto4', 'punto5'] as const) {
        minVal = Math.min(minVal, record[key]);
        maxVal = Math.max(maxVal, record[key]);
      }

      // Calculate percentage deviation
      const sp = ((maxVal - minVal) / minVal) * 100;

      // Normalize values to fit within the image
      const normalize = (value: number) => {
        return ((value - minVal) / (maxVal - minVal)) * (imageSize * 0.8) + (imageSize * 0.1); // Add a 10% margin
      };

      const p1 = normalize(record.punto1);
      const p2 = normalize(record.punto2);
      const p3 = normalize(record.punto3);
      const p4 = normalize(record.punto4);
      const p5 = normalize(record.punto5);

      // X positions are evenly spaced
      const x1 = imageSize * 0.1;
      const x2 = imageSize * 0.3;
      const x3 = imageSize * 0.5;
      const x4 = imageSize * 0.7;
      const x5 = imageSize * 0.9;

      // Y positions are normalized
      const y1 = imageSize - p1;
      const y2 = imageSize - p2;
      const y3 = imageSize - p3;
      const y4 = imageSize - p4;
      const y5 = imageSize - p5;

      // Create SVG path
      const path = `M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} L ${x4},${y4} L ${x5},${y5}`;

      // Construct the SVG
      const svgImage = (
        <svg width={imageSize} height={imageSize} key={index} data-svg-name={String(record.timestamp)}>
          <rect width="100%" height="100%" fill={backgroundColor} />
          <path d={path} stroke="black" strokeWidth="2" fill="none" />
          <circle cx={x1} cy={y1} r="5" fill="black" />
          <circle cx={x2} cy={y2} r="5" fill="black" />
          <circle cx={x3} cy={y3} r="5" fill="black" />
          <circle cx={x4} cy={y4} r="5" fill="black" />
          <circle cx={x5} cy={y5} r="5" fill="black" />
        </svg>
      );

      return svgImage;
    });
    setImages(newImages);
  };

  const buildLinePlot = async () => {
    const imageSize = 320;
    const newImages = parsedData.map((record, index) => {
       // Determine background color
      const backgroundColor = record.punto1 > record.punto5 ? 'red' : 'green';
      const gradientId = `gradient${index}`;

      // Determine background gradient
      const backgroundGradient = record.punto1 > record.punto5
        ? `url(#${gradientId})`
        : `url(#${gradientId})`;

       // Define color stops for gradient
      const colorStops = 5;
      const gradientLevels: string[] = [];

      if (backgroundColor === 'red') {
        for (let i = 0; i < colorStops; i++) {
          // Exclude 10% of the lightest and darkest shades
          const lightness = 90 - (i * (70 / (colorStops - 1))) + 10;
          gradientLevels.push(`hsl(0, 100%, ${lightness}%)`);  // Red gradient levels
        }
      } else {
        for (let i = 0; i < colorStops; i++) {
          // Exclude 10% of the lightest and darkest shades
          const lightness = 90 - (i * (70 / (colorStops - 1))) + 10;
          gradientLevels.push(`hsl(120, 100%, ${lightness}%)`);  // Green gradient levels
        }
      }

      // Find min and max values
      let minVal = record.punto1;
      let maxVal = record.punto1;
      for (const key of ['punto2', 'punto3', 'punto4', 'punto5'] as const) {
        minVal = Math.min(minVal, record[key]);
        maxVal = Math.max(maxVal, record[key]);
      }

      // Calculate percentage deviation
      const sp = ((maxVal - minVal) / minVal) * 100;

      // Normalize values to fit within the image
      const normalize = (value: number) => {
        return ((value - minVal) / (maxVal - minVal)) * (imageSize * 0.8) + (imageSize * 0.1); // Add a 10% margin
      };

      const p1 = normalize(record.punto1);
      const p2 = normalize(record.punto2);
      const p3 = normalize(record.punto3);
      const p4 = normalize(record.punto4);
      const p5 = normalize(record.punto5);

      // X positions are evenly spaced
      const x1 = imageSize * 0.1;
      const x2 = imageSize * 0.3;
      const x3 = imageSize * 0.5;
      const x4 = imageSize * 0.7;
      const x5 = imageSize * 0.9;

      // Y positions are normalized
      const y1 = imageSize - p1;
      const y2 = imageSize - p2;
      const y3 = imageSize - p3;
      const y4 = imageSize - p4;
      const y5 = imageSize - p5;

      // Create SVG path
      const path = `M ${x1},${y1} L ${x2},${y2} L ${x3},${y3} L ${x4},${y4} L ${x5},${y5}`;

      // Construct the SVG
      const svgImage = (
        <svg width={imageSize} height={imageSize} key={index}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              {gradientLevels.map((color, i) => (
                <stop key={i} offset={`${i * (100 / (colorStops - 1))}%`} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={backgroundGradient} />
          <path d={path} stroke="black" strokeWidth="2" fill="none" />
          <circle cx={x1} cy={y1} r="5" fill="black" />
          <circle cx={x2} cy={y2} r="5" fill="black" />
          <circle cx={x3} cy={y3} r="5" fill="black" />
          <circle cx={x4} cy={y4} r="5" fill="black" />
          <circle cx={x5} cy={y5} r="5" fill="black" /> 
        </svg>
      );

      return svgImage;
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
            <Button onClick={buildLinePlot} className="mr-2">Line Plot</Button>
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
