import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../client/api";
import { useDropzone } from "react-dropzone";

function FileUploadButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      const response = await api.post("/api/v1/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to upload file.");
      }

      toast.success("File uploaded successfully.");
    } catch (error) {
      toast.error("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <ToastContainer />
      <div
        {...getRootProps()}
        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-dashed border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 disabled:opacity-50 disabled:pointer-events-none"
      >
        <input
          {...getInputProps()}
          type="file"
          accept=".csv"
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
        Upload CSV
      </div>
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={isLoading || !selectedFile}
        className="mt-4 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Upload File
      </button>
    </div>
  );
}

export default FileUploadButton;
