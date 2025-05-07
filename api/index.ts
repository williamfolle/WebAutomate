import express from 'express';
import multer from 'multer';
import { processZipAndCSVFiles } from '../server/utils/fileProcessor';
import fs from 'fs';
import path from 'path';

// Create Vercel serverless API handler
const app = express();
app.use(express.json());

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  // Handle SPA routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    }
  });
}

// Export handler for Vercel serverless function
export default app;
