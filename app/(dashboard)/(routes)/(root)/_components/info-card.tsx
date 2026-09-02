import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant = "default",
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-purple-200 transition-all duration-300 rounded-2xl flex items-center gap-x-4 p-4.5 font-sans group">
      <IconBadge variant={variant} icon={Icon} size="default" />
      <div>
        <p className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight group-hover:text-purple-700 transition-colors">
          {label}
        </p>
        <p className="text-slate-500 text-xs font-semibold mt-0.5">
          {numberOfItems} {numberOfItems === 1 ? "Module Enregistré" : "Modules Enregistrés"}
        </p>
      </div>
    </div>
  );
};