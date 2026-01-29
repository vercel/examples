import { Text } from "@vercel/examples-ui";
import { Dispatch, SetStateAction } from "react";

const Modal = ({
  title,
  subtitle,
  button,
  hideClose,
  showModal,
  setShowModal,
}: {
  title: string;
  subtitle: string;
  button: JSX.Element;
  hideClose?: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  if (!showModal) return null;
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 py-5 sm:p-6 sm:py-4">
              <div className="flex justify-between mb-6 items-center">
                <h2 className="text-lg font-bold">{title}</h2>
                {!hideClose && (
                  <button
                    type="button"
                    className="text-gray-600 hover:text-black rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    data-modal-hide="defaultModal"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                )}
              </div>

              <Text>{subtitle}</Text>

              {button}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
