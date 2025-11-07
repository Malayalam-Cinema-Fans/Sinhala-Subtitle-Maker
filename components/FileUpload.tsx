
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './IconComponents';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full text-center">
        <label
            htmlFor="srt-upload"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
            ${isDragging ? 'border-blue-400 bg-gray-700' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'}`}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-10 h-10 mb-4 text-gray-400"/>
                <p className="mb-2 text-lg text-gray-300">
                    <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">.SRT (Subtitle file)</p>
            </div>
            <input id="srt-upload" type="file" className="hidden" accept=".srt" onChange={handleFileChange} />
        </label>
    </div>
  );
};

export default FileUpload;
