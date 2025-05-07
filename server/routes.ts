import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { processZipAndCSVFiles } from "./utils/fileProcessor";

// Setup multer for file uploads with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to process uploaded files
  app.post("/api/process-files", (req, res, next) => {
    console.log("Before multer middleware");
    console.log("Request headers:", JSON.stringify(req.headers));
    console.log("Has body?", !!req.body);
    next();
  }, upload.fields([
    { name: "zip", maxCount: 1 },
    { name: "csv", maxCount: 10 },
  ]), async (req, res) => {
    try {
      console.log("Processing files request received");
      console.log("Request body keys:", Object.keys(req.body || {}));
      
      if (!req.files) {
        console.log("No files in request.files");
        return res.status(400).json({ message: "No files were uploaded" });
      }
      
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      
      // Log request details for debugging
      console.log("Received files:", Object.keys(files).join(", "));
      console.log("Request headers:", JSON.stringify(req.headers));
      
      // Validate file presence
      if (!files.zip || files.zip.length === 0) {
        return res.status(400).json({ message: "ZIP file is required" });
      }

      if (!files.csv || files.csv.length === 0) {
        return res.status(400).json({ message: "At least one CSV file is required" });
      }
      
      console.log("ZIP file:", files.zip[0].originalname);
      console.log("CSV files:", files.csv.map(f => f.originalname).join(", "));

      // Process the files
      const result = await processZipAndCSVFiles(files.zip[0], files.csv);

      return res.json(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error processing files";
      return res.status(500).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
