"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Lock,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfDocumentViewerProps {
  pdfUrl?: string | null;
  title: string;
  moduleCode?: string | null;
  isLocked: boolean;
  isCompleted: boolean;
  onComplete?: () => void;
  isLoading?: boolean;
}

export const PdfDocumentViewer = ({
  pdfUrl,
  title,
  moduleCode,
  isLocked,
  isCompleted,
  onComplete,
  isLoading,
}: PdfDocumentViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isLocked) {
    return (
      <div className="relative aspect-video max-h-[500px] bg-slate-900 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white space-y-4 p-8 border border-slate-800 shadow-2xl">
        <div className="p-4 rounded-2xl bg-purple-900/50 border border-purple-500/30 text-purple-200">
          <Lock className="h-10 w-10" />
        </div>
        <div className="text-center space-y-1 max-w-md">
          <h3 className="text-xl font-black">Chapitre Verrouillé</h3>
          <p className="text-xs text-slate-300">
            Veuillez vous inscrire à ce module pour accéder à ce cours PDF et aux supports de formation.
          </p>
        </div>
      </div>
    );
  }

  // Google Docs PDF Embed Viewer fallback for smooth cross-browser rendering
  const viewerUrl = pdfUrl
    ? pdfUrl.startsWith("http")
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      : pdfUrl
    : null;

  return (
    <div className={`space-y-4 font-sans ${isFullscreen ? "fixed inset-0 z-[200] bg-slate-950 p-6 overflow-y-auto" : ""}`}>
      {/* 1. Header Toolbar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-700 text-white font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                {moduleCode ? `Module ${moduleCode}` : "Support PDF"}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Lecteur Intégré OFPPT
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-1">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 gap-1.5 cursor-pointer">
                <Download className="h-4 w-4 text-purple-400" />
                <span className="hidden sm:inline">Télécharger PDF</span>
              </Button>
            </a>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
            title={isFullscreen ? "Réduire" : "Plein Écran"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 2. Embedded PDF Reader Canvas */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 min-h-[550px] sm:min-h-[680px] flex flex-col justify-between">
        {pdfUrl ? (
          <iframe
            src={viewerUrl || pdfUrl}
            title={title}
            className="w-full h-[550px] sm:h-[680px] rounded-3xl border-0 bg-white"
            allow="fullscreen"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white space-y-4">
            <div className="p-4 rounded-2xl bg-purple-900/50 border border-purple-500/30 text-purple-300">
              <BookOpen className="h-10 w-10" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-lg font-black">Support de Cours PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consultez le texte explicatif ci-dessous et téléchargez les documents joints pour ce chapitre.
              </p>
            </div>
          </div>
        )}

        {/* 3. Bottom Action Bar inside Reader */}
        <div className="bg-slate-900/95 backdrop-blur-md p-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300 font-medium hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lecture du support de cours OFPPT</span>
          </div>

          {onComplete && (
            <Button
              onClick={onComplete}
              disabled={isLoading}
              className={`ml-auto font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                isCompleted
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {isCompleted ? "Cours Terminée (Relire)" : "J'ai lu ce cours (Terminer)"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
