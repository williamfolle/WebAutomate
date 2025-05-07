import express from 'express';
import multer from 'multer';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { JSDOM } from 'jsdom';

// Create Vercel serverless API handler
const app = express();
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Basic JS content for scripts
const JS_CONTENT = {
  "LLWebServerExtended.js": `const LLWebServer = { AutoRefreshStart: function(i){} }; function showLoginStatus() {}`,
  "envelope-cartesian.js": `function init() {}`,
  "ew-log-viewer.js": `console.log('Log viewer loaded');`,
  "scriptcustom.js": `console.log('Custom script loaded');`
};

// API endpoint for processing files
app.post('/api/process-files', upload.fields([
  { name: 'zip', maxCount: 1 },
  { name: 'csv', maxCount: 10 }
]), async (req, res) => {
  try {
    // Simple validation
    if (!req.files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const zipFile = files['zip']?.[0];
    const csvFiles = files['csv'] || [];
    
    if (!zipFile) {
      return res.status(400).json({ error: 'ZIP file is required' });
    }
    
    // Simply extract and reconstruct the ZIP
    const zip = await JSZip.loadAsync(zipFile.buffer);
    
    // Add JS files 
    for (const [filename, content] of Object.entries(JS_CONTENT)) {
      zip.file(filename, content);
    }
    
    // Generate a new ZIP
    const modifiedZipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE"
    });
    
    // Return results
    return res.json({
      zipBuffer: modifiedZipBuffer,
      stats: {
        elementsProcessed: 0,
        attributesAdded: 0
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

// Export handler for Vercel serverless function
export default app;
