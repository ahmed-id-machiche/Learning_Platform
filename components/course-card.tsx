import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
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
  moduleCode,
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
      <div className="relative flex flex-col justify-between h-full bg-white border border-slate-200/90 rounded-2xl p-4 hover:shadow-lg hover:border-sky-300 transition-all duration-300 overflow-hidden font-sans">
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

            {/* Top Left: Code Module Badge */}
            {moduleCode ? (
              <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
                {moduleCode}
              </div>
            ) : (
              <div className="absolute top-2.5 left-2.5 bg-sky-700 text-white font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
                OFPPT
              </div>
            )}

            {/* Top Right: Free/Paid Access Badge */}
            {isFree || !price ? (
              <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-xs uppercase tracking-wider">
                Accès Gratuit
              </div>
            ) : (
              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-xs">
                {formatPrice(price)}
              </div>
            )}
          </div>

          {/* Card Body Content */}
          <div className="space-y-2 pt-1">
            {/* Category & Filière Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filiere && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                  {filiere}
                </span>
              )}
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                {category}
              </span>
            </div>

            {/* Course Title */}
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>

            {/* Course Metadata */}
            <div className="flex items-center gap-x-3 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-x-1.5 font-semibold text-slate-600">
                <IconBadge size="sm" icon={BookOpen} />
                <span>
                  {chaptersLength} {chaptersLength === 1 ? "Chapitre" : "Chapitres"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress & Action CTA */}
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

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 group-hover:bg-sky-700 group-hover:text-white px-3 py-1.5 rounded-xl transition-all duration-200 shadow-2xs">
              <span>{hasStarted ? "Reprendre" : "Voir le module"}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};