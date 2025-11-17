import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
      <AlertTriangle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;
