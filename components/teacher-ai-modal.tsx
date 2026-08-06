"use client";

import { useState } from "react";
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
  RefreshCw,
  Brain,
  MessageSquare,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Chapter {
  id: string;
  title: string;
}

interface TeacherAiModalProps {
  courseId: string;
  courseTitle: string;
  chapters: Chapter[];
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

export const TeacherAiModal = ({
  courseId,
  courseTitle,
  chapters,
}: TeacherAiModalProps) => {
  const [activeTab, setActiveTab] = useState<"qcm" | "chat">("qcm");

  // QCM Form states
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("Moyen");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [generatedQcm, setGeneratedQcm] = useState<GeneratedQcm | null>(null);

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Bonjour ! Je suis votre assistant pédagogique IA pour le module **"${courseTitle}"**. Comment puis-je vous aider aujourd'hui ? (Ex: Générer un QCM, résumer un chapitre, proposer un sujet de TP)`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Handlers
  const handleGenerateQcm = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(
        `/api/courses/${courseId}/ai/generate-qcm`,
        {
          chapterId: selectedChapterId || undefined,
          numQuestions,
          difficulty,
          customTopic,
        }
      );

      setGeneratedQcm(response.data);
      toast.success("Examen QCM généré avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Échec de la génération du QCM avec Gemini AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQcm = async () => {
    if (!generatedQcm) return;

    try {
      setIsSaving(true);
      await axios.post(`/api/courses/${courseId}/quizzes`, {
        title: generatedQcm.title || `QCM - ${courseTitle}`,
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

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const response = await axios.post(`/api/courses/${courseId}/ai/chat`, {
        messages: newMessages,
      });

      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
      toast.error("Erreur de communication avec l'assistant IA.");
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="sm"
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-purple-500/20 border-0 flex items-center gap-x-2 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
          <span>Assistant Enseignant AI</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-slate-50">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <SheetHeader>
            <div className="flex items-center gap-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-white flex items-center gap-x-2">
                  Assistant IA Enseignant
                  <span className="text-xs bg-purple-500/30 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full font-normal">
                    Gemini Flash AI
                  </span>
                </SheetTitle>
                <p className="text-xs text-slate-400 mt-1">
                  Module: <span className="text-purple-300 font-medium">{courseTitle}</span>
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Tabs */}
          <div className="flex gap-x-2 mt-6 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab("qcm")}
              className={`flex-1 flex items-center justify-center gap-x-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "qcm"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              Générateur QCM & Examens
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-x-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "chat"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat Pédagogique IA
            </button>
          </div>
        </div>

        {/* TAB 1: QCM GENERATOR */}
        {activeTab === "qcm" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Form Settings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-x-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                Paramètres de l'Examen QCM
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chapter Select */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Cible de l'examen
                  </label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Tout le module (Global)</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Chapitre: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Count */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Nombre de questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={3}>3 Questions (Test Rapide)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Examen Complet)</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Niveau de difficulté
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Facile">Facile (Notions de base)</option>
                    <option value="Moyen">Moyen (Application)</option>
                    <option value="Difficile">Difficile (Analyse & Réfléchi)</option>
                  </select>
                </div>

                {/* Custom Topic Prompt */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Consigne spécifique (Optionnel)
                  </label>
                  <Input
                    placeholder="Ex: Insister sur la syntaxe SQL..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="text-xs bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateQcm}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Génération par Gemini 2.5 Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <span>Générer l'Examen QCM avec l'IA</span>
                  </>
                )}
              </Button>
            </div>

            {/* Generated QCM Preview */}
            {generatedQcm && (
              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                      Aperçu de l'Examen Généré
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {generatedQcm.title}
                    </h4>
                  </div>
                  <Button
                    onClick={handleSaveQcm}
                    disabled={isSaving}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-x-1.5"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>Sauvegarder</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {generatedQcm.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-start gap-x-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 pt-0.5">
                          {q.question}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pl-8">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                              opt.isCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-medium"
                                : "bg-white border-slate-200 text-slate-700"
                            }`}
                          >
                            <span>{opt.text}</span>
                            {opt.isCorrect ? (
                              <span className="flex items-center gap-x-1 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="h-3 w-3" /> Correcte
                              </span>
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-slate-300" />
                            )}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="ml-8 p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900">
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

        {/* TAB 2: TEACHER CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-x-2.5 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="flex items-center gap-x-2 text-xs text-slate-500 pl-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-600" />
                  <span>L'assistant IA réfléchit...</span>
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setChatInput("Fais-moi un résumé synthétique de ce module.")}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                📝 Résumer le cours
              </button>
              <button
                onClick={() => setChatInput("Donne-moi 3 idées de sujet de TP pratique pour les étudiants.")}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap"
              >
                💡 Idées de TP
              </button>
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-x-2">
              <Input
                placeholder="Posez votre question pédagogique..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="text-xs bg-slate-50 border-slate-200 focus-visible:ring-purple-600"
              />
              <Button
                onClick={handleSendChat}
                disabled={isSendingChat || !chatInput.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
