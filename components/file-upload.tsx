"use client";

import { UploadCloud, Loader2, Link2, CheckCircle2, Film } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string, name?: string) => void;
  endpoint: string;
}

export const FileUpload = ({
  onChange,
  endpoint,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadedName, setUploadedName] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = endpoint === "chapterVideo";

  const fileTypeLabel = isVideo
    ? "Fichier vidéo MP4, WebM, MOV (toutes tailles supportées)"
    : endpoint === "courseImage"
    ? "Image (JPG, PNG)"
    : "Fichier PDF, Word, TP ou Zip";

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadProgress(`Téléversement direct (${fileSizeMB} Mo)...`);

      // Clean filename for cloud storage
      const fileExt = file.name.split(".").pop() || "mp4";
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `videos/${Date.now()}_${cleanFileName}`;

      // STREAM UPLOAD: Pass raw File directly to Supabase Storage (Zero Base64 RAM usage!)
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage
          .from("attachments")
          .getPublicUrl(data.path);

        setUploadedName(file.name);
        onChange(publicData.publicUrl, file.name);
        toast.success("Vidéo téléversée avec succès !");
        return;
      }

      // If bucket does not exist or public permission is restricted, fallback for smaller files
      if (file.size < 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setUploadedName(file.name);
            onChange(reader.result, file.name);
            toast.success("Vidéo chargée !");
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(
          "Impossible de téléverser la vidéo directement. Assurez-vous que le stockage cloud est actif ou collez un lien."
        );
      }
    } catch (err) {
      console.error("[STREAM_UPLOAD_ERROR]", err);
      toast.error("Erreur lors du téléversement de la vidéo.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
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
      uploadFile(file);
    }
  };

  return (
    <div className="w-full space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={
          isVideo
            ? "video/*"
            : endpoint === "courseImage"
            ? "image/*"
            : ".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
        }
      />

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? "border-sky-500 bg-sky-50/50 scale-[0.99]"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-sky-400"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-3 space-y-3">
            <Loader2 className="h-9 w-9 text-sky-600 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-sky-800">Envoi direct de la vidéo en cours...</p>
              <p className="text-[11px] text-slate-500 font-medium">{uploadProgress}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3.5 bg-white shadow-xs rounded-2xl mb-2 text-sky-600 border border-slate-100">
              {isVideo ? <Film className="h-7 w-7 text-sky-600" /> : <UploadCloud className="h-7 w-7 text-sky-600" />}
            </div>
            <p className="text-xs font-bold text-slate-800 hover:text-sky-700 transition">
              {isVideo ? "Sélectionner la vidéo du professeur depuis le PC" : "Cliquez pour choisir un fichier ou glissez-déposez"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium text-center">
              {fileTypeLabel}
            </p>
          </>
        )}
      </div>

      {uploadedName && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="truncate">Vidéo chargée : <strong>{uploadedName}</strong></span>
        </div>
      )}

      {/* Option for Direct URL */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowUrlInput(!showUrlInput);
          }}
          className="text-sky-700 font-semibold hover:underline text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Link2 className="h-3.5 w-3.5" />
          {showUrlInput ? "Masquer la saisie d'URL" : "Ou saisir un lien vidéo externe (YouTube / Cloud)"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-x-2 pt-1">
          <Input
            placeholder="Ex: https://.../video.mp4"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-xs h-9 rounded-xl border-slate-200 bg-white"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput) {
                const name = urlInput.split("/").pop()?.split("?")[0] || "Video_Lien.mp4";
                setUploadedName(name);
                onChange(urlInput, name);
                toast.success("Lien enregistré !");
              }
            }}
            disabled={!urlInput}
            className="px-4 py-1.5 bg-sky-700 text-white rounded-xl text-xs font-bold hover:bg-sky-800 disabled:opacity-50 transition shrink-0 cursor-pointer"
          >
            Valider
          </button>
        </div>
      )}
    </div>
  );
};
