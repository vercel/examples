"use client";

export default function LoginPage() {
  const redirectToLogin = () => {
    window.location.href = "/api/users/login";
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Acme Enterprises
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to continue
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={redirectToLogin}
              className="w-full flex justify-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
