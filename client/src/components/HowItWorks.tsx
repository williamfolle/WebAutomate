export default function HowItWorks() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          How It Works
        </h2>

        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-800 mb-1">1. File Upload</h3>
            <p>
              Upload the ZIP file containing the website structure and CSV files 
              with "Name" and "Address" data.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">2. Automatic Processing</h3>
            <p>
              The system identifies HTML elements with the "nv" attribute and adds
              custom attributes based on CSV data.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">3. Download Result</h3>
            <p>
              After processing, you can download the ZIP file with all HTML elements
              modified according to the defined rules.
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-1">Supported Elements</h3>
            <p className="text-blue-600">
              The system processes &lt;input&gt;, &lt;checkbox&gt;,
              &lt;select&gt;, &lt;button&gt;, and &lt;radio&gt; elements with
              specific formatting for each type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
