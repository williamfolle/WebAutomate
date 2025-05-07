import { Button } from "@/components/ui/button";
import { ProcessingStatus as Status, ProcessingStats } from "@shared/types";

interface ProcessingStatusProps {
  status: Status;
  stats: ProcessingStats;
  errorMessage: string;
  onDownload: () => void;
}

export default function ProcessingStatus({
  status,
  stats,
  errorMessage,
  onDownload,
}: ProcessingStatusProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Processing Status
        </h2>

        {/* Initial Status */}
        {status === "idle" && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Upload the required files to start processing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {(status === "processing" || status === "uploading") && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Processing files...
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This may take a moment depending on the file size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Status */}
        {status === "success" && (
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Processing completed successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    All HTML elements have been processed. You can download 
                    the modified ZIP file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Status */}
        {status === "error" && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Processing Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {errorMessage ||
                      "An error occurred while processing the files. Please check that the files are in the correct format and try again."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Stats */}
        {status === "success" && (
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-gray-800">
              Processing Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">
                  Elements Processed
                </span>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats.elementsProcessed}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm text-gray-500">
                  Attributes Added
                </span>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats.attributesAdded}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full py-6 text-base"
                onClick={onDownload}
              >
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download Processed ZIP</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
