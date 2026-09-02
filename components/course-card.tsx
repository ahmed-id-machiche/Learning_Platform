import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  moduleCode?: string | null;
  filiere?: string | null;
  isFree?: boolean;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  filiere,
  isFree = true,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  const isCompleted = progress === 100;
  const hasStarted = progress !== null && progress > 0;

  return (
    <Link href={`/courses/${id}`} className="block h-full group">
      <div className="relative flex flex-col justify-between h-full bg-white border border-slate-200/90 rounded-2xl p-3.5 hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden font-sans">
        {/* Top Media & Details Wrapper */}
        <div className="space-y-3">
          {/* Image Container with Zoom and Badges */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
            <Image
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              alt={title}
              src={imageUrl || "/placeholder.png"}
            />

            {/* Top Right: Free/Paid Access Badge */}
            {isFree || !price ? (
              <div className="absolute top-2.5 right-2.5 bg-emerald-600/95 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-xs uppercase tracking-wider">
                Gratuit
              </div>
            ) : (
              <div className="absolute top-2.5 right-2.5 bg-purple-900 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
                {formatPrice(price)}
              </div>
            )}
          </div>

          {/* Card Body Content */}
          <div className="space-y-2 pt-0.5">
            {/* Category & Filière Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filiere && (
                <span className="text-[11px] font-bold text-purple-800 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                  {filiere}
                </span>
              )}
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                {category}
              </span>
            </div>

            {/* Course Title */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>

            {/* Course Metadata */}
            <div className="flex items-center gap-x-2 text-xs text-slate-600 font-semibold pt-0.5">
              <div className="p-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapitre" : "Chapitres"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Progress & Udemy CTA */}
        <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
          {progress !== null ? (
            <CourseProgress
              variant={isCompleted ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : null}

          {/* Action CTA Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-500">
              {isCompleted ? (
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                </span>
              ) : hasStarted ? (
                "En cours"
              ) : (
                "Module Officiel"
              )}
            </span>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-purple-700 group-hover:bg-purple-800 px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-xs">
              <span>{hasStarted ? "Reprendre" : "Voir le module"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};