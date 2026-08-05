"use client";

import { CheckCircle2, Clock, FileCheck, Search, User, Users } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

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
}

interface TeacherStudentsClientProps {
  students: StudentData[];
}

export const TeacherStudentsClient = ({
  students,
}: TeacherStudentsClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((s) =>
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
          className="pl-9 text-xs h-9 bg-white"
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
          {filteredStudents.map((student) => (
            <div
              key={student.studentId}
              className="bg-white border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {student.studentName || "Étudiant"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {student.studentEmail || `ID: ${student.studentId.substring(0, 12)}...`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-2 text-xs font-semibold">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 flex items-center gap-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {student.completedModulesCount} Terminés
                    </span>
                    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 flex items-center gap-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      {student.inProgressModulesCount} En cours
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Avancement dans vos modules:
                  </h4>
                  {student.enrolledModules.map((mod) => (
                    <div key={mod.courseId} className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
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

              <div className="pt-2 border-t flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-x-1 font-medium text-emerald-700">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  {student.tpSubmissionsCount} TP(s) rendus
                </span>
                <span className="text-slate-400 text-[11px]">
                  {student.gradedSubmissionsCount} TP(s) notés
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
