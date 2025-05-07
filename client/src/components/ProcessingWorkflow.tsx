interface ProcessingWorkflowProps {
  activeStep: number;
}

export default function ProcessingWorkflow({ activeStep }: ProcessingWorkflowProps) {
  const steps = [
    {
      id: 1,
      title: "File Upload",
      description:
        "Upload the ZIP file containing the website structure and CSV files with the data.",
    },
    {
      id: 2,
      title: "Processing",
      description:
        "The system identifies HTML elements and applies attributes based on CSV data.",
    },
    {
      id: 3,
      title: "Download",
      description:
        "Download the modified ZIP file with all custom attributes applied.",
    },
  ];

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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Processing Workflow
        </h2>

        {/* Process Flow Steps */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 relative mb-4 md:mb-0 md:mr-4"
              data-step={step.id}
            >
              <div
                className={`${
                  step.id <= activeStep
                    ? "bg-blue-50 border-primary"
                    : "bg-gray-50 border-gray-300"
                } rounded-lg p-4 h-full border-l-4`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`${
                      step.id <= activeStep
                        ? "bg-primary"
                        : "bg-gray-300"
                    } text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2`}
                  >
                    {step.id}
                  </div>
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
