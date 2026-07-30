"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useState } from "react";

import { IconBadge } from "@/components/icon-badge";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  const [isError, setIsError] = useState(false);

  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-white flex flex-col justify-between">
        <div>
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100">
            {imageUrl && !isError ? (
              <Image
                fill
                unoptimized
                className="object-cover"
                alt={title}
                src={imageUrl}
                onError={() => setIsError(true)}
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-medium text-xs">
                No Image Available
              </div>
            )}
          </div>
          <div className="flex flex-col pt-2">
            <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
              {title}
            </div>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        </div>

        <div className="pt-2">
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          {progress !== null ? (
            <div className="text-xs text-emerald-700 font-medium">
              {Math.round(progress)}% Complete
            </div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {price ? `$${price}` : "Free"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
