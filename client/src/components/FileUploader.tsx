import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadState } from "@shared/types";
import { getFileIcon } from "@/lib/fileUtils";

interface FileUploaderProps {
  fileState: FileUploadState;
  onFileChange: (state: Partial<FileUploadState>) => void;
  onProcess: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export default function FileUploader({
  fileState,
  onFileChange,
  onProcess,
  isProcessing,
  disabled,
}: FileUploaderProps) {
  const zipInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Handle ZIP file selection
  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].name.toLowerCase().endsWith(".zip")) {
      onFileChange({ zipFile: files[0] });
    }
  };

  // Handle CSV files selection
  const handleCSVFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newCsvFiles = Array.from(files).filter((file) => 
        file.name.toLowerCase().endsWith(".csv")
      );
      // Append to existing CSV files instead of replacing them
      onFileChange({ 
        csvFiles: [...fileState.csvFiles, ...newCsvFiles]
      });
    }
  };

  // Handle ZIP drop zone click
  const handleZipDropZoneClick = () => {
    zipInputRef.current?.click();
  };

  // Handle CSV drop zone click
  const handleCSVDropZoneClick = () => {
    csvInputRef.current?.click();
  };

  // Handle removing ZIP file
  const handleRemoveZipFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange({ zipFile: null });
    if (zipInputRef.current) {
      zipInputRef.current.value = "";
    }
  };

  // Handle removing CSV file
  const handleRemoveCSVFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = [...fileState.csvFiles];
    newFiles.splice(index, 1);
    onFileChange({ csvFiles: newFiles });
  };

  // Handle drag over for ZIP
  const handleZipDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("bg-blue-50", "border-primary");
    e.currentTarget.classList.remove("bg-gray-50", "border-gray-300");
  };

  // Handle drag leave for ZIP
  const handleZipDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-blue-50", "border-primary");
    e.currentTarget.classList.add("bg-gray-50", "border-gray-300");
  };

  // Handle drop for ZIP
  const handleZipDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-blue-50", "border-primary");
    e.currentTarget.classList.add("bg-gray-50", "border-gray-300");

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.toLowerCase().endsWith(".zip")) {
      onFileChange({ zipFile: files[0] });
    }
  };

  // Handle drag over for CSV
  const handleCSVDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("bg-blue-50", "border-primary");
    e.currentTarget.classList.remove("bg-gray-50", "border-gray-300");
  };

  // Handle drag leave for CSV
  const handleCSVDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-blue-50", "border-primary");
    e.currentTarget.classList.add("bg-gray-50", "border-gray-300");
  };

  // Handle drop for CSV
  const handleCSVDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event propagation
    e.currentTarget.classList.remove("bg-blue-50", "border-primary");
    e.currentTarget.classList.add("bg-gray-50", "border-gray-300");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newCsvFiles = Array.from(files).filter((file) => 
        file.name.toLowerCase().endsWith(".csv")
      );
      if (newCsvFiles.length > 0) {
        // Add to existing files instead of replacing them
        onFileChange({ 
          csvFiles: [...fileState.csvFiles, ...newCsvFiles]
        });
        
        console.log(`Added ${newCsvFiles.length} CSV files: ${newCsvFiles.map(f => f.name).join(', ')}`);
      } else {
        console.log("No valid CSV files were found in the drop");
      }
    }
  };

  const isProcessButtonDisabled = !fileState.zipFile || fileState.csvFiles.length === 0 || disabled;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          File Upload
        </h2>

        {/* ZIP File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website ZIP File <span className="text-red-500">*</span>
          </label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 transition-colors hover:bg-gray-100 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!disabled ? handleZipDropZoneClick : undefined}
            onDragOver={!disabled ? handleZipDragOver : undefined}
            onDragLeave={!disabled ? handleZipDragLeave : undefined}
            onDrop={!disabled ? handleZipDrop : undefined}
          >
            <div className="space-y-1 text-center">
              {getFileIcon("zip")}
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-600 focus-within:outline-none">
                  <span>Select a ZIP file</span>
                  <input
                    ref={zipInputRef}
                    type="file"
                    className="sr-only"
                    accept=".zip,.ZIP"
                    onChange={handleZipFileChange}
                    disabled={disabled}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                ZIP file containing the website structure
              </p>
            </div>
          </div>
          {fileState.zipFile && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center">
                {getFileIcon("zip", "h-5 w-5 text-primary mr-2")}
                <span className="text-sm font-medium text-gray-700">
                  {fileState.zipFile.name}
                </span>
                <button
                  className="ml-auto text-gray-500 hover:text-gray-700"
                  onClick={!disabled ? handleRemoveZipFile : undefined}
                  disabled={disabled}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CSV Files Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV Files <span className="text-red-500">*</span>
          </label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 transition-colors hover:bg-gray-100 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={!disabled ? handleCSVDropZoneClick : undefined}
            onDragOver={!disabled ? handleCSVDragOver : undefined}
            onDragLeave={!disabled ? handleCSVDragLeave : undefined}
            onDrop={!disabled ? handleCSVDrop : undefined}
          >
            <div className="space-y-1 text-center">
              {getFileIcon("csv")}
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-600 focus-within:outline-none">
                  <span>Select CSV files</span>
                  <input
                    ref={csvInputRef}
                    type="file"
                    className="sr-only"
                    accept=".csv,.CSV"
                    multiple
                    onChange={handleCSVFilesChange}
                    disabled={disabled}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                CSV files containing data for attribute manipulation
              </p>
            </div>
          </div>
          {fileState.csvFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {fileState.csvFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center">
                    {getFileIcon("csv", "h-5 w-5 text-primary mr-2")}
                    <span className="text-sm font-medium text-gray-700">
                      {file.name}
                    </span>
                    <button
                      className="ml-auto text-gray-500 hover:text-gray-700"
                      onClick={(e) => !disabled && handleRemoveCSVFile(index, e)}
                      disabled={disabled}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Process Button */}
        <div className="mt-6">
          <Button
            className="w-full py-6 text-base"
            onClick={onProcess}
            disabled={isProcessButtonDisabled}
          >
            <div className="flex items-center justify-center">
              {isProcessing && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{isProcessing ? "Processing..." : "Process Files"}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
