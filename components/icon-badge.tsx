import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backgroundVariants = cva(
  "rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-purple-500/20 border border-purple-400/20",
        success: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/20 border border-emerald-400/20",
        warning: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20 border border-amber-400/20",
        sky: "bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-sky-500/20 border border-sky-400/20",
      },
      size: {
        default: "p-3",
        sm: "p-1.5",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const iconVariants = cva("text-white shrink-0 stroke-[2.2]", {
  variants: {
    variant: {
      default: "text-white",
      success: "text-white",
      warning: "text-white",
      sky: "text-white",
    },
    size: {
      default: "h-5 w-5",
      sm: "h-3.5 w-3.5",
      lg: "h-7 w-7",
    },
  },
  defaultVariants: {
      variant: "default",
      size: "default",
  },
});

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon;
}

export const IconBadge = ({
  icon: Icon,
  variant,
  size,
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};