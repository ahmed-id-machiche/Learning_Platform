"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileCheck,
  Search,
  User,
  Users,
  ShieldAlert,
  ShieldCheck,
  UserX,
  GraduationCap,
  AlertCircle,
  Filter,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { OFPPT_FILIERES } from "@/lib/ofppt-constants";

interface ModuleProgressInfo {
  courseId: string;
  title: string;
  percentage: number;
  isCompleted: boolean;
}

interface StudentData {
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  year?: string | null;
  filiere?: string | null;
  isApproved?: boolean;
  enrolledModules: ModuleProgressInfo[];
  completedModulesCount: number;
  inProgressModulesCount: number;
  tpSubmissionsCount: number;
  gradedSubmissionsCount: number;
  isBlocked?: boolean;
}

interface TeacherStudentsClientProps {
  students: StudentData[];
}

export const TeacherStudentsClient = ({
  students,
}: TeacherStudentsClientProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Client-side state for instant approval UI updates
  const [approvalMap, setApprovalMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    students.forEach((s) => {
      map[s.studentId] = s.isApproved !== undefined ? s.isApproved : true;
    });
    return map;
  });

  // Client-side state for instant block UI updates
  const [blockedMap, setBlockedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    students.forEach((s) => {
      map[s.studentId] = Boolean(s.isBlocked);
    });
    return map;
  });

  const onToggleApproval = async (studentId: string, nextApprovedState: boolean) => {
    try {
      setLoadingId(studentId);
      // Optimistically update approval state
      setApprovalMap((prev) => ({ ...prev, [studentId]: nextApprovedState }));

      await axios.patch(`/api/students/${studentId}/approve`, {
        isApproved: nextApprovedState,
      });

      if (nextApprovedState) {
        toast.success("Stagiaire approuvé avec succès ! Il a désormais accès aux cours.");
      } else {
        toast.success("Demande d'approbation révoquée.");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pending-students-updated"));
      }
      router.refresh();
    } catch {
      setApprovalMap((prev) => ({ ...prev, [studentId]: !nextApprovedState }));
      toast.error("Erreur lors de la modification de l'approbation.");
    } finally {
      setLoadingId(null);
    }
  };

  const onToggleBlock = async (studentId: string) => {
    const currentBlocked = Boolean(blockedMap[studentId]);
    const nextState = !currentBlocked;

    try {
      setLoadingId(studentId);
      setBlockedMap((prev) => ({ ...prev, [studentId]: nextState }));

      await axios.patch(`/api/students/${studentId}`, {
        isBlocked: nextState,
      });

      if (nextState) {
        toast.success("L'accès de l'étudiant a été bloqué.");
      } else {
        toast.success("L'étudiant a été débloqué avec succès.");
      }
      router.refresh();
    } catch {
      setBlockedMap((prev) => ({ ...prev, [studentId]: currentBlocked }));
      toast.error("Erreur lors de la modification du statut d'accès.");
    } finally {
      setLoadingId(null);
    }
  };

  const onRemoveStudent = async (studentId: string, studentName?: string) => {
    const confirmRemove = confirm(
      `Voulez-vous vraiment refuser / retirer ${studentName || "cet étudiant"} ? Sa fiche et ses accès seront supprimés.`
    );
    if (!confirmRemove) return;

    try {
      setLoadingId(studentId);
      await axios.delete(`/api/students/${studentId}/approve`);
      toast.success("La fiche de l'étudiant a été retirée.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pending-students-updated"));
      }
      router.refresh();
    } catch {
      toast.error("Erreur lors du retrait de l'étudiant.");
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = students.filter((s) => !approvalMap[s.studentId]).length;

  const filteredStudents = students.filter((s) => {
    const isApproved = Boolean(approvalMap[s.studentId]);
    if (activeTab === "pending" && isApproved) return false;
    if (activeTab === "approved" && !isApproved) return false;

    const matchesSearch =
      (s.studentName && s.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.studentEmail && s.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.filiere && s.filiere.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.year && s.year.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.enrolledModules.some((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Pending Approval Banner Counter */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-amber-900 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">
                {pendingCount} stagiaire{pendingCount > 1 ? "s" : ""} en attente de validation
              </h4>
              <p className="text-xs text-amber-800/80">
                Certains étudiants ont choisi leur année & filière et attendent votre approbation pour accéder aux cours.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setActiveTab("pending")}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
          >
            Voir les demandes
          </Button>
        </div>
      )}

      {/* Top Filter Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "all"
                ? "bg-purple-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Tous ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>En Attente ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "approved"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approuvés ({students.length - pendingCount})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="h-4 w-4 absolute top-2.5 left-3 text-slate-400" />
          <Input
            placeholder="Rechercher stagiaire, filière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50/80 border-slate-200 rounded-xl focus:bg-white"
          />
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">Aucun stagiaire dans cette catégorie</h3>
          <p className="text-xs text-slate-500 mt-1">
            Les demandes d'inscription et stagiaires s'afficheront ici.
          </p>
        </div>
      )}

      {filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isApproved = Boolean(approvalMap[student.studentId]);
            const isBlocked = Boolean(blockedMap[student.studentId]);

            const matchedFiliere = OFPPT_FILIERES.find((f) => f.value === student.filiere);
            const filiereBadgeLabel = matchedFiliere ? matchedFiliere.shortName : student.filiere;

            return (
              <div
                key={student.studentId}
                className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition duration-200 ${
                  !isApproved
                    ? "border-amber-300 bg-amber-50/15"
                    : isBlocked
                    ? "border-rose-200 bg-rose-50/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Top Header: Student Info + Badges */}
                  <div className="flex items-start justify-between border-b pb-3.5 gap-2">
                    <div className="flex items-center gap-x-3">
                      <div
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          !isApproved
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : isBlocked
                            ? "bg-rose-100 text-rose-700 border-rose-200"
                            : "bg-purple-100 text-purple-800 border-purple-200"
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900">
                            {student.studentName || "Stagiaire"}
                          </h3>

                          {/* Approval Status Badge */}
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Approuvé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                              <Clock className="h-3 w-3 text-amber-700 animate-pulse" />
                              En Attente
                            </span>
                          )}

                          {isBlocked && (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              <ShieldAlert className="h-3 w-3 text-rose-600" />
                              Bloqué
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 font-medium">
                          {student.studentEmail || `ID: ${student.studentId.substring(0, 12)}...`}
                        </p>

                        {/* Filière & Year Info Tags */}
                        {(student.year || student.filiere) && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {student.year && (
                              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <GraduationCap className="h-3 w-3 text-purple-600" />
                                {student.year}
                              </span>
                            )}
                            {filiereBadgeLabel && (
                              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                {filiereBadgeLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modules Progress Stream */}
                  {student.enrolledModules.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Avancement dans vos modules:
                      </h4>
                      {student.enrolledModules.map((mod) => (
                        <div key={mod.courseId} className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                              {mod.title}
                            </span>
                            <span className="font-bold text-blue-700">{mod.percentage}%</span>
                          </div>
                          <Progress value={mod.percentage} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Nouveau stagiaire (Aucun module démarré)
                    </div>
                  )}
                </div>

                {/* Card Footer: Submissions Stats + Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-x-3">
                    <span className="flex items-center gap-x-1 font-medium text-emerald-700">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      {student.tpSubmissionsCount} TP(s) rendus
                    </span>
                  </div>

                  {/* Approve, Block & Delete Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Approve Button for Pending Students */}
                    {!isApproved ? (
                      <Button
                        onClick={() => onToggleApproval(student.studentId, true)}
                        disabled={loadingId === student.studentId}
                        size="sm"
                        className="h-8 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approuver</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onToggleApproval(student.studentId, false)}
                        disabled={loadingId === student.studentId}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-bold text-slate-500 hover:text-slate-700 px-2 rounded-xl"
                        title="Révoquer l'accès"
                      >
                        Révoquer
                      </Button>
                    )}

                    {/* Block / Unblock Button */}
                    <Button
                      onClick={() => onToggleBlock(student.studentId)}
                      disabled={loadingId === student.studentId}
                      size="sm"
                      variant="outline"
                      className={`h-8 text-xs font-bold px-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
                        isBlocked
                          ? "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                          : "border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100"
                      }`}
                      title={isBlocked ? "Débloquer l'étudiant" : "Bloquer l'étudiant"}
                    >
                      {isBlocked ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Débloquer</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                          <span>Bloquer</span>
                        </>
                      )}
                    </Button>

                    {/* Delete Student Button */}
                    <Button
                      onClick={() => onRemoveStudent(student.studentId, student.studentName)}
                      disabled={loadingId === student.studentId}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-bold px-2.5 rounded-xl flex items-center gap-1 cursor-pointer"
                      title="Refuser ou retirer la demande"
                    >
                      <UserX className="h-3.5 w-3.5 text-rose-600" />
                      <span>Refuser</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
