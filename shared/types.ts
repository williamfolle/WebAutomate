export interface CSVData {
  name: string;
  address: string;
  format: string;
}

export interface ProcessingStats {
  elementsProcessed: number;
  attributesAdded: number;
}

export interface ProcessingResult {
  zipBuffer: Buffer;
  stats: ProcessingStats;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface FileUploadState {
  zipFile: File | null;
  csvFiles: File[];
}
