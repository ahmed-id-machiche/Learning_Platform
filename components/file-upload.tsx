"use client";

import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  onChange: (url?: string, name?: string) => void;
  endpoint: string;
}

export const FileUpload = ({
  onChange,
  endpoint,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTypeLabel =
    endpoint === "chapterVideo"
      ? "Video (512GB)"
      : endpoint === "courseImage"
      ? "Image (4MB)"
      : "File (PDF, Video, Image up to 100MB)";

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadSelected = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedFile) {
      processFile(selectedFile);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={
          endpoint === "chapterVideo"
            ? "video/*"
            : endpoint === "courseImage"
            ? "image/*"
            : ".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
        }
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
            : "border-slate-300 bg-white/70 hover:bg-slate-50/80 hover:border-blue-400"
        }`}
      >
        <div className="p-3 bg-slate-200/60 rounded-full mb-3 text-slate-500">
          <UploadCloud className="h-8 w-8 text-slate-600" />
        </div>
        <p className="text-sm font-bold text-indigo-600 hover:underline">
          Choose files or drag and drop
        </p>
        <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">
          {fileTypeLabel}
        </p>

        <button
          type="button"
          onClick={handleUploadSelected}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2 rounded-md shadow-sm transition-all flex items-center justify-center gap-x-1"
        >
          Upload 1 file
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowUrlInput(!showUrlInput);
          }}
          className="text-blue-600 font-medium hover:underline text-xs"
        >
          {showUrlInput ? "Hide URL option" : "Or enter URL directly"}
        </button>
      </div>

      {showUrlInput && (
        <div className="mt-2 flex gap-x-2">
          <Input
            placeholder="Paste URL (e.g. https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-xs h-8"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput) {
                const name = urlInput.split("/").pop() || "Attachment";
                onChange(urlInput, name);
              }
            }}
            disabled={!urlInput}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
