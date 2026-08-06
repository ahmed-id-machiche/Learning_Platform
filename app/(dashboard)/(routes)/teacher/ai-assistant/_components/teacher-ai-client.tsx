"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Sparkles,
  Bot,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Save,
  BookOpen,
  MessageSquare,
  Trash2,
  PlusCircle,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Chapter {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  moduleCode: string | null;
  chapters: Chapter[];
}

interface TeacherAiPageClientProps {
  courses: Course[];
}

interface QcmOption {
  text: string;
  isCorrect: boolean;
}

interface QcmQuestion {
  question: string;
  explanation: string;
  options: QcmOption[];
}

interface GeneratedQcm {
  title: string;
  description?: string;
  questions: QcmQuestion[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const TeacherAiPageClient = ({ courses }: TeacherAiPageClientProps) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"chat" | "qcm">("chat");

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // QCM Form states
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("Moyen");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatedQcm, setGeneratedQcm] = useState<GeneratedQcm | null>(null);

  // PDF Attachment state
  const [pdfFile, setPdfFile] = useState<{ name: string; base64: string } | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Veuillez sélectionner un fichier au format PDF (.pdf)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPdfFile({ name: file.name, base64: reader.result });
        toast.success(`Fichier PDF "${file.name}" importé avec succès !`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Bonjour ! Je suis votre assistant pédagogique IA Gemini Flash. Vous pouvez poser des questions, discuter ou importer un fichier PDF de cours pour générer un examen QCM avec correction !`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  const handleGenerateQcm = async () => {
    const targetCourseId = selectedCourseId || "general";

    try {
      setIsGenerating(true);
      const response = await axios.post(
        `/api/courses/${targetCourseId}/ai/generate-qcm`,
        {
          chapterId: selectedChapterId || undefined,
          numQuestions,
          difficulty,
          customTopic,
          pdfBase64: pdfFile?.base64,
          pdfFileName: pdfFile?.name,
        }
      );

      setGeneratedQcm(response.data);
      toast.success("Examen QCM généré avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Échec de la génération du QCM.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQcm = async () => {
    if (!generatedQcm || !selectedCourseId) return;

    try {
      setIsSaving(true);
      await axios.post(`/api/courses/${selectedCourseId}/quizzes`, {
        title: generatedQcm.title || `QCM - ${selectedCourse?.title || "Examen"}`,
        chapterId: selectedChapterId || undefined,
        questions: generatedQcm.questions,
      });

      toast.success("QCM enregistré dans votre module !");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de sauvegarder le QCM.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isSendingChat) return;

    const targetCourseId = selectedCourseId || "general";

    const userMsg: ChatMessage = {
      role: "user",
      content: pdfFile
        ? `[Fichier PDF joint: ${pdfFile.name}]\n\n${chatInput}`
        : chatInput,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const response = await axios.post(
        `/api/courses/${targetCourseId}/ai/chat`,
        {
          messages: newMessages,
          pdfBase64: pdfFile?.base64,
        }
      );

      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
      toast.error("Erreur de communication avec l'assistant IA.");
    } finally {
      setIsSendingChat(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Discussion réinitialisée. En quoi puis-je vous aider ?`,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Course Selection & Tab Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-x-3 w-full md:w-auto">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="w-full md:w-80">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Module de formation Cible
            </label>
            {courses.length === 0 ? (
              <div className="flex items-center gap-x-2 pt-0.5">
                <span className="text-xs text-amber-700 font-medium">
                  Aucun module créé.
                </span>
                <Link href="/teacher/create">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 rounded-lg flex items-center gap-x-1 font-medium shadow-sm"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Créer un module</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedChapterId("");
                  setGeneratedQcm(null);
                }}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none cursor-pointer shadow-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.moduleCode ? `[${c.moduleCode}] ${c.title}` : c.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-x-2 py-2 px-5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "chat"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Chatbot Pédagogique IA
          </button>

          <button
            onClick={() => setActiveTab("qcm")}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-x-2 py-2 px-5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "qcm"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
            Générateur QCM & Examens
          </button>
        </div>
      </div>

      {/* Hidden PDF Input */}
      <input
        type="file"
        ref={pdfInputRef}
        accept=".pdf,application/pdf"
        onChange={handlePdfChange}
        className="hidden"
      />

      {/* PDF Attachment Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 border border-purple-200/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-x-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-x-1.5">
              Document PDF de Cours / Examens
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                Analyse Multimodale Gemini Flash
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pdfFile
                ? `Document actif : "${pdfFile.name}" (L'IA analysera directement le contenu de ce PDF)`
                : "Importez n'importe quel fichier PDF (cours, TP, polycopié) pour générer l'examen QCM et sa correction automatique."}
            </p>
          </div>
        </div>

        {pdfFile ? (
          <div className="flex items-center gap-x-2 bg-white border border-purple-300 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-xs font-bold text-purple-900 truncate max-w-[220px]">
              📄 {pdfFile.name}
            </span>
            <button
              onClick={() => setPdfFile(null)}
              className="text-slate-400 hover:text-red-600 p-0.5 rounded-md hover:bg-red-50 transition-all"
              title="Retirer le fichier PDF"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            size="sm"
            className="bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-x-2"
          >
            <Upload className="h-4 w-4 text-purple-600" />
            <span>Importer un PDF (.pdf)</span>
          </Button>
        )}
      </div>

      {/* TAB 1: CHATBOT INTERFACE */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
          {/* Top Bar */}
          <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-x-2">
                  Assistant Formateur Gemini Flash
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    En Ligne
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Actif sur : <span className="text-purple-300 font-medium">{selectedCourse?.title}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white text-xs gap-x-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Effacer la discussion
            </Button>
          </div>

          {/* Chat Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-x-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-br-none shadow-md"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex items-center gap-x-2 text-xs text-slate-500 pl-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                <span>L'assistant IA rédige une réponse...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 self-center pr-1">Propositions :</span>
            <button
              onClick={() => setChatInput("Rédige un résumé pédagogique de ce module pour mes étudiants.")}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-purple-50 hover:border-purple-300 px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all"
            >
              📝 Résumé du cours
            </button>
            <button
              onClick={() => setChatInput("Propose-moi 3 idées d'exercices pratiques (TP) guidés.")}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-purple-50 hover:border-purple-300 px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all"
            >
              💡 Sujets de TP
            </button>
            <button
              onClick={() => setChatInput("Quelles sont les compétences clés que les étudiants doivent maîtriser ?")}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-purple-50 hover:border-purple-300 px-3 py-1 rounded-full whitespace-nowrap text-xs transition-all"
            >
              🎯 Compétences clés
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-4 px-6 bg-white border-t border-slate-200 flex items-center gap-x-3">
            <Input
              placeholder={`Posez votre question sur "${selectedCourse?.title || "ce module"}"...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="text-xs bg-slate-50 border-slate-200 focus-visible:ring-purple-600 p-3 h-11"
            />
            <Button
              onClick={handleSendChat}
              disabled={isSendingChat || !chatInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-5 rounded-xl flex items-center gap-x-2"
            >
              <span>Envoyer</span>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: QCM EXAM GENERATOR */}
      {activeTab === "qcm" && (
        <div className="space-y-6">
          {/* Controls Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Génération d'Examen QCM Automatique
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Chapter Cible */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Chapitre Cible
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none cursor-pointer shadow-none"
                >
                  <option value="">Tout le module (Global)</option>
                  {selectedCourse?.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Count */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre de questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none cursor-pointer shadow-none"
                >
                  <option value={3}>3 Questions (Test Rapide)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={10}>10 Questions (Examen Complet)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Niveau de difficulté
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none cursor-pointer shadow-none"
                >
                  <option value="Facile">Facile (Notions de base)</option>
                  <option value="Moyen">Moyen (Application)</option>
                  <option value="Difficile">Difficile (Analyse)</option>
                </select>
              </div>

              {/* Custom Topic */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Consigne spécifique
                </label>
                <Input
                  placeholder="Ex: Insister sur les cas d'erreur..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="text-xs bg-slate-50 border-slate-200 h-[38px]"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateQcm}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Génération de l'examen par l'IA Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span>Générer l'Examen QCM avec Correction ✨</span>
                </>
              )}
            </Button>
          </div>

          {/* Generated QCM Preview */}
          {generatedQcm && (
            <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md">
                    Examen QCM Généré
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {generatedQcm.title}
                  </h3>
                </div>
                <Button
                  onClick={handleSaveQcm}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-x-2 px-5 py-2.5"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Sauvegarder dans le module</span>
                </Button>
              </div>

              <div className="space-y-6">
                {generatedQcm.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start gap-x-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-900 pt-0.5">
                        {q.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-10">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                            opt.isCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{opt.text}</span>
                          {opt.isCorrect ? (
                            <span className="flex items-center gap-x-1 text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                              <CheckCircle2 className="h-3 w-3" /> Correcte
                            </span>
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-300" />
                          )}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="ml-10 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                        <span className="font-bold text-blue-800 block mb-0.5">
                          💡 Correction & Explication Pédagogique :
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
