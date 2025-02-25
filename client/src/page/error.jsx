import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loading";
import { useNavigate } from "react-router-dom"; // For navigation

const Error = ({ status = "404", content = "Page Not Found" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  }, [dispatch]);

  const handleGoHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl border border-gray-100 max-w-md mx-auto">
        {/* Error Code */}
        <div className="text-4xl font-bold text-black-600 mb-4 animate-bounce">
          {status}
        </div>

        {/* Error Message */}
        <div className="text-2xl font-semibold text-gray-800 mb-6">
          {content}
        </div>

        {/* Go to Homepage Button */}
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          Go to Homepage
        </button>

        {/* Optional: Add a decorative icon */}
        {/* <div className="mt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default Error;