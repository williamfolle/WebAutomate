import JSZip from "jszip";
import Papa from "papaparse";
import { JSDOM } from "jsdom";
import { ProcessingResult, CSVData } from "@shared/types";
import path from "path";

// Store the JS scripts as embedded strings for Vercel deployment
const EMBEDDED_SCRIPTS = {
  'LLWebServerExtended.js': `/*****************
* LLWebServer    *
* Version 1.2.0 **
* 2025/02/14     *
*******************/

// Simplified version for the web generator
const LLWebServer = {
  AutoRefreshStart: function(interval) {
    console.log('AutoRefresh started with interval:', interval);
  }
};

function showLoginStatus() {
  console.log('Login status shown');
}`,

  'ew-log-viewer.js': `// Simplified log viewer script
console.log('Log viewer initialized');`,

  'envelope-cartesian.js': `// Simplified envelope-cartesian script
function init() {
  console.log('Envelope cartesian initialized');
}`,

  'scriptcustom.js': `// Custom script for the application
console.log('Custom script loaded');`
};

/**
 * Parse multiple CSV files and return their data
 */
async function parseCSVFiles(csvFiles: Express.Multer.File[]): Promise<CSVData[]> {
  try {
    if (!csvFiles || csvFiles.length === 0) {
      return [];
    }

    const parsedData: CSVData[] = [];

    for (const csvFile of csvFiles) {
      const content = csvFile.buffer.toString('utf8');
      
      const parseResult = Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
      });

      if (parseResult.data && parseResult.data.length > 0) {
        parsedData.push({
          filename: csvFile.originalname,
          data: parseResult.data as Record<string, string>[],
        });
      }
    }

    return parsedData;
  } catch (error) {
    console.error("Error parsing CSV files:", error);
    throw new Error("Failed to parse CSV files");
  }
}

/**
 * Find a matching row in the CSV data based on the NV value
 */
function findMatchingCSVRow(
  csvData: CSVData[],
  nvValue: string | null
): Record<string, string> | null {
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

/**
 * Process a checkbox input element with CSV data
 */
function processCheckboxElement(
  element: HTMLInputElement,
  csvRow: Record<string, string>
): void {
  const addressValue = element.getAttribute("nv");
  if (!addressValue) return;

  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", addressValue);
  
  // Set data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set data-llweb-format attribute with the format (default to empty string)
  const formatKey = Object.keys(csvRow).find(key => 
    key.toLowerCase() === "format" || key.toLowerCase().includes("format")
  );
  
  if (formatKey && csvRow[formatKey]) {
    element.setAttribute("data-llweb-format", csvRow[formatKey]);
  } else {
    element.setAttribute("data-llweb-format", "");
  }
}

/**
 * Process a radio input element with CSV data
 */
function processRadioElement(
  element: HTMLInputElement,
  csvRow: Record<string, string>
): void {
  const addressValue = element.getAttribute("nv");
  if (!addressValue) return;

  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", addressValue);
  
  // Set data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set name attribute
  element.setAttribute("name", `rad-${addressValue}`);
  
  // Determine if this is "true" or "false" radio based on value
  const value = element.getAttribute("value")?.toLowerCase();
  
  // Set id with suffix based on true/false value
  const idSuffix = value === "true" || value === "1" ? "1" : "2";
  element.setAttribute("id", `rad-ctrl-${addressValue}-${idSuffix}`);
}

/**
 * Process a regular input element with CSV data
 */
function processInputElement(
  element: HTMLInputElement,
  csvRow: Record<string, string>
): void {
  const addressValue = element.getAttribute("nv");
  if (!addressValue) return;

  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", addressValue);
  
  // Set data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set data-llweb-format attribute with the format (default to empty string)
  const formatKey = Object.keys(csvRow).find(key => 
    key.toLowerCase() === "format" || key.toLowerCase().includes("format")
  );
  
  if (formatKey && csvRow[formatKey]) {
    element.setAttribute("data-llweb-format", csvRow[formatKey]);
  } else {
    element.setAttribute("data-llweb-format", "");
  }
}

/**
 * Process a select element with CSV data
 */
function processSelectElement(
  element: HTMLSelectElement,
  csvRow: Record<string, string>
): void {
  const addressValue = element.getAttribute("nv");
  if (!addressValue) return;

  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", addressValue);
  
  // Set data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set data-llweb-format attribute with the format (default to empty string)
  const formatKey = Object.keys(csvRow).find(key => 
    key.toLowerCase() === "format" || key.toLowerCase().includes("format")
  );
  
  if (formatKey && csvRow[formatKey]) {
    element.setAttribute("data-llweb-format", csvRow[formatKey]);
  } else {
    element.setAttribute("data-llweb-format", "");
  }
}

/**
 * Process a button element with CSV data
 */
function processButtonElement(
  element: HTMLButtonElement,
  csvRow: Record<string, string>
): void {
  const addressValue = element.getAttribute("nv");
  if (!addressValue) return;

  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", addressValue);
  
  // Set data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set data-llweb-format attribute with the format (default to empty string)
  const formatKey = Object.keys(csvRow).find(key => 
    key.toLowerCase() === "format" || key.toLowerCase().includes("format")
  );
  
  if (formatKey && csvRow[formatKey]) {
    element.setAttribute("data-llweb-format", csvRow[formatKey]);
  } else {
    element.setAttribute("data-llweb-format", "");
  }
}

/**
 * Process ZIP and CSV files to add custom attributes to HTML elements
 */
export async function processZipAndCSVFiles(
  zipFile: Express.Multer.File,
  csvFiles: Express.Multer.File[]
): Promise<ProcessingResult> {
  try {
    console.log("ZIP file:", zipFile ? zipFile.originalname : 'undefined');
    console.log("CSV files count:", csvFiles ? csvFiles.length : 'undefined');
    
    // Load and parse CSV files
    const csvData = await parseCSVFiles(csvFiles);
    
    if (!zipFile || !zipFile.buffer) {
      throw new Error("Invalid or missing ZIP file");
    }
    
    // Load and extract ZIP
    console.log("Loading ZIP file with buffer size:", zipFile.buffer.length);
    const zip = await JSZip.loadAsync(zipFile.buffer);
    
    // Remove 404.html and 404.css files
    Object.keys(zip.files).forEach(filename => {
      if (filename === '404.html' || filename === '404.css') {
        zip.remove(filename);
      }
    });
    
    // Add JS files to the ZIP using embedded content
    for (const [filename, content] of Object.entries(EMBEDDED_SCRIPTS)) {
      zip.file(filename, content);
      console.log(`Added embedded JS file: ${filename}`);
    }
    
    // Check if public folder exists and handle renaming
    const publicFiles = Object.keys(zip.files).filter(filename => 
      filename.startsWith('public/') || filename === 'public'
    );
    
    if (publicFiles.length > 0) {
      console.log("Found public folder, renaming to img/");
      
      // Create an async task for each file to be copied
      const copyPromises = publicFiles.map(async (publicPath) => {
        const file = zip.files[publicPath];
        if (!file) return;
        
        const imgPath = publicPath === 'public' ? 'img' : publicPath.replace('public/', 'img/');
        
        if (file.dir) {
          zip.folder(imgPath);
        } else {
          try {
            // Use arraybuffer instead of blob for binary data
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
      
      console.log("Renamed public/ folder to img/");
    }
    
    let elementsProcessed = 0;
    let attributesAdded = 0;
    
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
    console.log("Processed CSS files to update public/ to img/ references");
    
    // Process HTML files
    const filePromises = Object.keys(zip.files).map(async (filename) => {
      const file = zip.files[filename];
      
      // Skip directories and non-HTML files
      if (file.dir || !filename.toLowerCase().endsWith(".html")) {
        return file;
      }
      
      // Read and parse HTML content
      const content = await file.async("text");
      const { window } = new JSDOM(content);
      const document = window.document;
      
      // Update all references from public/ to img/
      const updatePublicToImgPaths = (element: Document | Element) => {
        // Update image sources
        element.querySelectorAll('img[src^="public/"]').forEach(img => {
          const src = img.getAttribute('src');
          if (src) img.setAttribute('src', src.replace(/public\//g, 'img/'));
        });
        
        // Update CSS background images in style attributes
        element.querySelectorAll('[style*="public/"]').forEach(el => {
          const style = el.getAttribute('style');
          if (style) el.setAttribute('style', style.replace(/public\//g, 'img/'));
        });
        
        // Update link hrefs
        element.querySelectorAll('link[href^="public/"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href) link.setAttribute('href', href.replace(/public\//g, 'img/'));
        });
        
        // Update any other elements with src attribute
        element.querySelectorAll('[src^="public/"]').forEach(el => {
          const src = el.getAttribute('src');
          if (src) el.setAttribute('src', src.replace(/public\//g, 'img/'));
        });
        
        // Update any background attributes
        element.querySelectorAll('[background^="public/"]').forEach(el => {
          const bg = el.getAttribute('background');
          if (bg) el.setAttribute('background', bg.replace(/public\//g, 'img/'));
        });
        
        // Update inline styles
        element.querySelectorAll('style').forEach(style => {
          if (style.textContent) {
            style.textContent = style.textContent.replace(/public\//g, 'img/');
          }
        });
        
        // Also update data-background attributes (commonly used in some frameworks)
        element.querySelectorAll('[data-background^="public/"]').forEach(el => {
          const bg = el.getAttribute('data-background');
          if (bg) el.setAttribute('data-background', bg.replace(/public\//g, 'img/'));
        });
      };
      
      updatePublicToImgPaths(document);
      
      // Remove external connections (Google Fonts, unpkg)
      const externalLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="unpkg.com"]');
      externalLinks.forEach(link => {
        link.parentNode?.removeChild(link);
      });
      
      // Add custom code to head
      const headElement = document.head;
      const customHeadCode = `
<!--custom code 1-->
<script type="text/javascript" src="LLWebServerExtended.js"></script>
<script type='text/javascript' src='../js/base.js'></script>
<link rel='stylesheet' type='text/css' href='../style/common.css'>
<!--custom code 2-->
<script type="text/javascript" src="ew-log-viewer.js"></script>
<script type="text/javascript" src="envelope-cartesian.js"></script>
`;
      headElement.insertAdjacentHTML('beforeend', customHeadCode);
      
      // Add custom code to end of body
      const bodyElement = document.body;
      const customBodyCode = `
<!--custom code 3-->
<script type='text/javascript'>
    LLWebServer.AutoRefreshStart(1000);
    showLoginStatus();
    localStorage.setItem("showNeutralNavbar", true);
</script>
<script>
    document.addEventListener('DOMContentLoaded', init);
</script>
<script
      defer=""
      src="scriptcustom.js"
></script>
`;
      bodyElement.insertAdjacentHTML('beforeend', customBodyCode);
      
      // Find all elements with nv attribute
      const elementsWithNvAttr = document.querySelectorAll("[nv]");
      
      elementsWithNvAttr.forEach((element) => {
        const nvValue = element.getAttribute("nv");
        
        // Find matching CSV row
        const matchingRow = findMatchingCSVRow(csvData, nvValue);
        
        if (matchingRow) {
          elementsProcessed++;
          
          // Apply appropriate attributes based on element type
          if (element.tagName === "INPUT") {
            // Handle input elements
            const inputElement = element as HTMLInputElement;
            const inputType = inputElement.getAttribute("type");
            
            if (inputType === "checkbox") {
              processCheckboxElement(inputElement, matchingRow);
              attributesAdded += 3;
            } else if (inputType === "radio") {
              processRadioElement(inputElement, matchingRow);
              attributesAdded += 4; // name, data-llweb-par, data-llweb-refresh, id
            } else {
              processInputElement(inputElement, matchingRow);
              attributesAdded += 3;
            }
          } else if (element.tagName === "SELECT") {
            processSelectElement(element as HTMLSelectElement, matchingRow);
            attributesAdded += 3;
          } else if (element.tagName === "BUTTON") {
            processButtonElement(element as HTMLButtonElement, matchingRow);
            attributesAdded += 3;
          }
        }
      });
      
      // Update file content in ZIP
      return zip.file(filename, "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
    });
    
    // Wait for all files to be processed
    await Promise.all(filePromises);
    
    // Generate the modified ZIP file
    const modifiedZipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      mimeType: "application/zip"
    });
    
    return {
      zipBuffer: modifiedZipBuffer,
      stats: {
        elementsProcessed,
        attributesAdded,
      },
    };
  } catch (error) {
    console.error("Error processing files:", error);
    throw new Error(`Error processing files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
