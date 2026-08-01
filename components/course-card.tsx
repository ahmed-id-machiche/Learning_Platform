import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

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
  isFree,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col justify-between">
        <div>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image fill unoptimized className="object-cover" alt={title} src={imageUrl} />
            {moduleCode && (
              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                {moduleCode}
              </span>
            )}
          </div>
          <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium group-hover:text-emerald-700 transition line-clamp-2">
              {title}
            </div>
            <div className="flex flex-wrap gap-1 items-center mt-1">
              {filiere && (
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {filiere}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{category}</span>
            </div>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              <div className="flex items-center gap-x-1 text-slate-500">
                <IconBadge size="sm" icon={BookOpen} />
                <span>
                  {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : isFree || !price ? (
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md inline-block">
              Accès Gratuit (OFPPT)
            </span>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};