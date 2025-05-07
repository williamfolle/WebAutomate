import express from 'express';
import path from 'path';
import multer from 'multer';
import { processZipAndCSVFiles } from '../server/utils/fileProcessor';
import fs from 'fs';

// Ensure temp directory exists
const tempDir = path.join(process.cwd(), 'server/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Copy JS files to temp directory
const jsFiles = [
  'ew-log-viewer.js',
  'LLWebServerExtended.js',
  'scriptcustom.js',
  'envelope-cartesian.js'
];

// Create Vercel serverless API handler
const app = express();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Log middleware for debugging requests
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Has body?', !!req.body);
  next();
});

// API endpoint for processing files
app.post('/api/process-files', upload.fields([
  { name: 'zip', maxCount: 1 },
  { name: 'csv', maxCount: 10 }
]), async (req, res) => {
  console.log('Processing files request received');
  console.log('Request body keys:', Object.keys(req.body || {}));
  
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Multer types handling
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log('Received files:', Object.keys(files).join(', '));

    const zipFile = files['zip']?.[0];
    const csvFiles = files['csv'];

    if (!zipFile) {
      return res.status(400).json({ error: 'ZIP file is required' });
    }

    const result = await processZipAndCSVFiles(zipFile, csvFiles || []);
    
    return res.json({
      zipBuffer: result.zipBuffer,
      stats: result.stats
    });
  } catch (error) {
    console.error('Error processing files:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Static file serving for production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(process.cwd(), 'dist/client');
  app.use(express.static(clientDist));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// For Vercel serverless functions
export default app;