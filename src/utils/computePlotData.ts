export interface DataRecord {
  timestamp: string | Date;
  mm: boolean;
  punto1: number;
  punto2: number;
  punto3: number;
  punto4: number;
  punto5: number;
}

export interface PlotData {
  points: { x: number; y: number }[];
  backgroundColor: string;
  timestamp: string | Date;
}

export function computePlotData(record: DataRecord, imageSize: number): PlotData {
  let minVal = record.punto1;
  let maxVal = record.punto1;
  for (const key of ['punto2', 'punto3', 'punto4', 'punto5'] as const) {
    minVal = Math.min(minVal, record[key]);
    maxVal = Math.max(maxVal, record[key]);
  }
  const normalize = (value: number) =>
    ((value - minVal) / (maxVal - minVal)) * (imageSize * 0.8) + (imageSize * 0.1);

  const points = [
    { x: imageSize * 0.1, y: imageSize - normalize(record.punto1) },
    { x: imageSize * 0.3, y: imageSize - normalize(record.punto2) },
    { x: imageSize * 0.5, y: imageSize - normalize(record.punto3) },
    { x: imageSize * 0.7, y: imageSize - normalize(record.punto4) },
    { x: imageSize * 0.9, y: imageSize - normalize(record.punto5) },
  ];
  const backgroundColor = record.punto1 > record.punto5 ? 'red' : 'green';
  return { points, backgroundColor, timestamp: record.timestamp };
}