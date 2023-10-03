export default function MissingEdgeConfigDialog() {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* Heroicon name: outline/exclamation-triangle */}
                <svg
                  className="h-6 w-6 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  Incomplete Environment Variables Setup
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Follow these steps to finish the setup of this example:
                  </p>
                  <ol className="text-sm text-gray-500 list-disc ml-8 mt-2 flex gap-2 flex-col">
                    <li className="list-item list-disc">
                      Create an Edge Config and connect it to this project and
                      store its connection string under the{' '}
                      <span className="bg-gray-100 p-1 text-gray-900 rounded">
                        EDGE_CONFIG
                      </span>{' '}
                      environment variable
                    </li>
                    <li className="list-item list-disc">
                      Pull your latest Environment Variables if you are
                      developing locally
                    </li>
                    <li className="list-item list-disc">
                      Restart or redeploy your application
                    </li>
                  </ol>
                  <p className="text-sm text-gray-500 mt-2">
                    Then reload the page and this dialog will go away if your
                    setup is correct.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
              <a
                href="https://github.com/vercel/examples/blob/main/edge-middleware/maintenance-page/README.md#set-up-environment-variables"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
              >
                Open Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
