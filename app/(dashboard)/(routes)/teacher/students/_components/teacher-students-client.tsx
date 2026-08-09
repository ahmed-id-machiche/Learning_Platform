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
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Client-side state for instant UI update
  const [blockedMap, setBlockedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    students.forEach((s) => {
      map[s.studentId] = Boolean(s.isBlocked);
    });
    return map;
  });

  const onToggleBlock = async (studentId: string) => {
    const currentBlocked = Boolean(blockedMap[studentId]);
    const nextState = !currentBlocked;

    try {
      setLoadingId(studentId);
      // Optimistically update button state instantly
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
      // Revert if API fails
      setBlockedMap((prev) => ({ ...prev, [studentId]: currentBlocked }));
      toast.error("Erreur lors de la modification du statut d'accès.");
    } finally {
      setLoadingId(null);
    }
  };

  const onRemoveStudent = async (studentId: string, studentName?: string) => {
    const confirmRemove = confirm(
      `Voulez-vous vraiment retirer ${studentName || "cet étudiant"} ? L'accès à vos modules, ses progrès et ses devoirs seront définitivement supprimés.`
    );
    if (!confirmRemove) return;

    try {
      setLoadingId(studentId);
      await axios.delete(`/api/students/${studentId}`);
      toast.success("L'étudiant a été retiré de vos modules.");
      router.refresh();
    } catch {
      toast.error("Erreur lors du retrait de l'étudiant.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.studentName && s.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.studentEmail && s.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrolledModules.some((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-500" />
        <Input
          placeholder="Rechercher par nom, email, identifiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs h-10 bg-white border-slate-200 rounded-xl"
        />
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">Aucun étudiant inscrit pour le moment</h3>
          <p className="text-xs text-slate-500 mt-1">
            Les étudiants inscrits à vos modules et leur avancement s'afficheront ici.
          </p>
        </div>
      )}

      {filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const isBlocked = Boolean(blockedMap[student.studentId]);

            return (
              <div
                key={student.studentId}
                className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition ${
                  isBlocked ? "border-rose-200 bg-rose-50/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Top Header: Student Info + Badges */}
                  <div className="flex items-start justify-between border-b pb-3.5 gap-2">
                    <div className="flex items-center gap-x-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isBlocked ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">
                            {student.studentName || "Étudiant"}
                          </h3>
                          {isBlocked && (
                            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              <ShieldAlert className="h-3 w-3 text-rose-600" />
                              Bloqué
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {student.studentEmail || `ID: ${student.studentId.substring(0, 12)}...`}
                        </p>
                      </div>
                    </div>

                    {/* Progress Summary Badges */}
                    <div className="flex items-center gap-x-1.5 text-xs font-semibold shrink-0">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {student.completedModulesCount} Terminés
                      </span>
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        {student.inProgressModulesCount} En cours
                      </span>
                    </div>
                  </div>

                  {/* Modules Progress Stream */}
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
                </div>

                {/* Card Footer: Submissions Stats + Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-x-3">
                    <span className="flex items-center gap-x-1 font-medium text-emerald-700">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      {student.tpSubmissionsCount} TP(s) rendus
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {student.gradedSubmissionsCount} TP(s) notés
                    </span>
                  </div>

                  {/* Block and Delete Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Block / Unblock Button */}
                    <Button
                      onClick={() => onToggleBlock(student.studentId)}
                      disabled={loadingId === student.studentId}
                      size="sm"
                      variant="outline"
                      className={`h-8 text-xs font-bold px-3 rounded-xl flex items-center gap-1 cursor-pointer transition-colors ${
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

                    {/* Delete Student Enrollment Button */}
                    <Button
                      onClick={() => onRemoveStudent(student.studentId, student.studentName)}
                      disabled={loadingId === student.studentId}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-bold px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                      title="Retirer l'étudiant de la formation"
                    >
                      <UserX className="h-3.5 w-3.5 text-rose-600" />
                      <span>Retirer</span>
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
