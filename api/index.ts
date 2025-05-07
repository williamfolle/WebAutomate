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

/**
 * Parse multiple CSV files and return their data
 */
async function parseCSVFiles(csvFiles) {
  if (!csvFiles || csvFiles.length === 0) {
    return [];
  }

  const parsedData = [];

  for (const csvFile of csvFiles) {
    const content = csvFile.buffer.toString('utf8');
    
    const parseResult = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.data && parseResult.data.length > 0) {
      parsedData.push({
        filename: csvFile.originalname,
        data: parseResult.data,
      });
    }
  }

  return parsedData;
}

/**
 * Find a matching row in the CSV data based on the NV value
 */
function findMatchingCSVRow(csvData, nvValue) {
  if (!nvValue || !csvData || csvData.length === 0) {
    return null;
  }

  // Convert nvValue to lowercase for case-insensitive matching
  const lowerNvValue = nvValue.toLowerCase();

  // Try to find a match across all CSV files
  for (const csv of csvData) {
    for (const row of csv.data) {
      // Case-insensitive match for either "Address" or any key containing "address"
      const addressKey = Object.keys(row).find(key => 
        key.toLowerCase() === "address" || key.toLowerCase().includes("address")
      );

      if (addressKey && row[addressKey].toLowerCase() === lowerNvValue) {
        return row;
      }
    }
  }

  return null;
}

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
    
    const files = req.files;
    const zipFile = files['zip']?.[0];
    const csvFiles = files['csv'] || [];
    
    if (!zipFile) {
      return res.status(400).json({ error: 'ZIP file is required' });
    }
    
    // Parse CSV files
    const csvData = await parseCSVFiles(csvFiles);
    
    // Extract the ZIP
    const zip = await JSZip.loadAsync(zipFile.buffer);
    
    // Remove 404.html and 404.css files
    Object.keys(zip.files).forEach(filename => {
      if (filename === '404.html' || filename === '404.css') {
        zip.remove(filename);
      }
    });
    
    // Add JS files 
    for (const [filename, content] of Object.entries(JS_CONTENT)) {
      zip.file(filename, content);
    }
    
    // Check if public folder exists and handle renaming
    const publicFiles = Object.keys(zip.files).filter(filename => 
      filename.startsWith('public/') || filename === 'public'
    );
    
    if (publicFiles.length > 0) {
      // Create an async task for each file to be copied
      const copyPromises = publicFiles.map(async (publicPath) => {
        const file = zip.files[publicPath];
        if (!file) return;
        
        const imgPath = publicPath === 'public' ? 'img' : publicPath.replace('public/', 'img/');
        
        if (file.dir) {
          zip.folder(imgPath);
        } else {
          try {
            const content = await file.async('arraybuffer');
            zip.file(imgPath, content);
          } catch (error) {
            console.error(`Error copying file ${publicPath} to ${imgPath}:`, error);
          }
        }
      });
      
      // Wait for all copy operations to complete
      await Promise.all(copyPromises);
      
      // Remove the original public/ files/folders after copying
      for (const publicPath of publicFiles) {
        zip.remove(publicPath);
      }
    }
    
    // Handle CSS files separately to update image references
    const cssFilesPromises = Object.keys(zip.files).filter(filename => 
      filename.toLowerCase().endsWith(".css") && !zip.files[filename].dir
    ).map(async (filename) => {
      const file = zip.files[filename];
      const content = await file.async("text");
      
      // Replace all references to public/ with img/ in CSS files
      const updatedContent = content.replace(/public\//g, 'img/');
      
      // Update the file in the ZIP
      zip.file(filename, updatedContent);
    });
    
    // Wait for all CSS files to be processed
    await Promise.all(cssFilesPromises);
    
    let elementsProcessed = 0;
    let attributesAdded = 0;
    
    // Generate a new ZIP
    const modifiedZipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE"
    });
    
    // Return results
    return res.json({
      zipBuffer: modifiedZipBuffer,
      stats: {
        elementsProcessed,
        attributesAdded
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
