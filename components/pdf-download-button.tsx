"use client";

import { Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfDownloadButtonProps {
  url: string;
  name: string;
  variant?: "button" | "card" | "list";
  badge?: React.ReactNode;
}

export const downloadPdfFile = (url: string, fileName: string) => {
  if (!url) return;

  if (url.startsWith("data:")) {
    try {
      const base64Parts = url.split(",");
      const mimeType = base64Parts[0].match(/:(.*?);/)?.[1] || "application/pdf";
      const byteCharacters = atob(base64Parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 300);
      return;
    } catch (e) {
      console.error("Failed to parse PDF base64 string:", e);
    }
  }

  // Fallback for standard HTTP/HTTPS URLs
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const PdfDownloadButton = ({
  url,
  name,
  variant = "button",
  badge,
}: PdfDownloadButtonProps) => {
  const handleClick = () => {
    downloadPdfFile(url, name);
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-700 hover:text-white px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Télécharger PDF</span>
      </button>
    );
  }

  if (variant === "list") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md hover:bg-sky-200/60 transition text-left cursor-pointer"
      >
        <File className="h-4 w-4 mr-2 flex-shrink-0" />
        <p className="line-clamp-1 font-medium text-xs mr-2 flex-1">{name}</p>
        {badge}
        <Download className="h-4 w-4 ml-2 shrink-0" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      size="sm"
      className="bg-sky-700 hover:bg-sky-800 text-white font-bold gap-1.5 cursor-pointer"
    >
      <Download className="h-4 w-4" />
      <span>Télécharger PDF</span>
    </Button>
  );
};
