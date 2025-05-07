import JSZip from "jszip";
import Papa from "papaparse";
import { JSDOM } from "jsdom";
import { ProcessingResult, CSVData } from "@shared/types";
import fs from "fs";
import path from "path";

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
    
    // Add JS files to the ZIP
    try {
      // Read JS files from temp directory
      const jsFiles = [
        'ew-log-viewer.js',
        'LLWebServerExtended.js',
        'scriptcustom.js',
        'envelope-cartesian.js'
      ];
      
      for (const jsFile of jsFiles) {
        const filePath = path.join(process.cwd(), 'server/temp', jsFile);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          zip.file(jsFile, fileContent);
        }
      }
    } catch (error) {
      console.error("Error adding JS files:", error);
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

/**
 * Parse CSV files and return array of data
 */
async function parseCSVFiles(csvFiles: Express.Multer.File[]): Promise<CSVData[]> {
  const allData: CSVData[] = [];
  
  if (!csvFiles || csvFiles.length === 0) {
    console.log("No CSV files provided");
    return allData;
  }
  
  console.log(`Processing ${csvFiles.length} CSV files`);
  
  const csvPromises = csvFiles.map((file) => {
    return new Promise<void>((resolve, reject) => {
      if (!file || !file.buffer) {
        console.error("Invalid CSV file or missing buffer:", file?.originalname || "unknown file");
        resolve(); // Skip this file instead of rejecting
        return;
      }
      
      console.log(`Parsing CSV file: ${file.originalname}, buffer size: ${file.buffer.length}`);
      // @ts-ignore - Ignorando o erro de tipo aqui, pois o Papa.parse aceita string
      Papa.parse(file.buffer.toString(), {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results: Papa.ParseResult<any>) => {
          console.log(`CSV parse complete for ${file.originalname}, rows: ${results.data?.length}, columns: ${Object.keys(results.data[0] || {}).join(', ')}`);
          
          if (results.data && Array.isArray(results.data)) {
            results.data.forEach((row: any, rowIndex: number) => {
              // Normalize header keys to handle case-sensitivity
              const normalizedRow: Record<string, any> = {};
              Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase()] = row[key];
              });
              
              // Check for required columns case-insensitively
              const name = normalizedRow.name || row.Name || row.NAME;
              const address = normalizedRow.address || row.Address || row.ADDRESS;
              
              if (name && address) {
                const format = normalizedRow.format || row.Format || row.FORMAT || "";
                
                console.log(`Row ${rowIndex}: Found name=${name}, address=${address}, format=${format}`);
                
                allData.push({
                  name,
                  address,
                  format
                });
              } else {
                console.log(`Row ${rowIndex}: Skipping - missing required columns. name=${name}, address=${address}`);
              }
            });
            resolve();
          } else {
            reject(new Error(`Invalid CSV format in file ${file.originalname}`));
          }
        },
        error: (error: Papa.ParseError) => {
          console.error(`Error parsing CSV ${file.originalname}:`, error);
          reject(new Error(`Error parsing CSV ${file.originalname}: ${error.message}`));
        }
      });
    });
  });
  
  await Promise.all(csvPromises);
  console.log(`Total CSV rows processed: ${allData.length}`);
  return allData;
}

/**
 * Find matching row in CSV data based on nv attribute value
 */
function findMatchingCSVRow(csvData: CSVData[], nvValue: string | null): CSVData | undefined {
  if (!nvValue) return undefined;
  return csvData.find(row => row.name === nvValue);
}

/**
 * Process input element attributes
 */
function processInputElement(element: HTMLInputElement, csvRow: CSVData): void {
  element.setAttribute("data-llweb-par", csvRow.address);
  element.setAttribute("data-llweb-refresh", "true");
  element.setAttribute("id", `txt-ctrl-${csvRow.address}`);
  
  // Apply format if present
  if (csvRow.format) {
    applyFormatAttribute(element, csvRow.format);
  }
}

/**
 * Process checkbox element attributes
 */
function processCheckboxElement(element: HTMLInputElement, csvRow: CSVData): void {
  element.setAttribute("data-llweb-par", csvRow.address);
  element.setAttribute("data-llweb-refresh", "true");
  element.setAttribute("id", `chk-ctrl-${csvRow.address}`);
}

/**
 * Process select element attributes
 */
function processSelectElement(element: HTMLSelectElement, csvRow: CSVData): void {
  element.setAttribute("data-llweb-par", csvRow.address);
  element.setAttribute("data-llweb-refresh", "true");
  element.setAttribute("id", `sel-ctrl-${csvRow.address}`);
}

/**
 * Process button element attributes
 */
function processButtonElement(element: HTMLButtonElement, csvRow: CSVData): void {
  element.setAttribute("data-llweb-par", csvRow.address);
  element.setAttribute("data-llweb-refresh", "true");
  
  const value = element.getAttribute("value");
  if (value === "true") {
    element.setAttribute("id", `btn-ctrl-${csvRow.address}-1`);
  } else if (value === "false") {
    element.setAttribute("id", `btn-ctrl-${csvRow.address}-2`);
  }
}

/**
 * Process radio element attributes
 */
function processRadioElement(element: HTMLInputElement, csvRow: CSVData): void {
  // Set data-llweb-par attribute
  element.setAttribute("data-llweb-par", csvRow.address);
  
  // Set name attribute for all radio buttons in the same group
  element.setAttribute("name", `rad-${csvRow.address}`);
  
  // Add data-llweb-refresh attribute
  element.setAttribute("data-llweb-refresh", "true");
  
  // Set ID based on value (true/false)
  const value = element.getAttribute("value");
  if (value === "true") {
    element.setAttribute("id", `rad-ctrl-${csvRow.address}-1`);
  } else if (value === "false") {
    element.setAttribute("id", `rad-ctrl-${csvRow.address}-2`);
  }
}

/**
 * Apply format attribute based on format value
 */
function applyFormatAttribute(element: HTMLElement, format: string): void {
  switch (format) {
    case "xxx.y":
      element.setAttribute("data-llweb-format", "%.1D");
      break;
    case "xx.yy":
      element.setAttribute("data-llweb-format", "%.2D");
      break;
    case "x.yyy":
      element.setAttribute("data-llweb-format", "%.3D");
      break;
    case "%04x":
      element.setAttribute("data-llweb-format", "%04x");
      break;
    case "HH:MM":
      element.setAttribute("data-llweb-format", "HH:MM");
      break;
    // If format is not recognized, don't add any format attribute
  }
}
