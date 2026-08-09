import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-2xl flex items-center gap-x-4 p-4 font-sans">
      <IconBadge variant={variant} icon={Icon} size="default" />
      <div>
        <p className="font-bold text-slate-800 text-sm tracking-tight">{label}</p>
        <p className="text-slate-500 text-xs font-semibold mt-0.5">
          {numberOfItems} {numberOfItems === 1 ? "Module" : "Modules"}
        </p>
      </div>
    </div>
  );
};