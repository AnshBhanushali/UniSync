import { BookOpen, Calendar, Mail, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceType } from "@/types/chat";

interface SourceBadgeProps {
  type: SourceType;
  className?: string;
}

const sourceConfig: Record<SourceType, { icon: typeof BookOpen; label: string; className: string }> = {
  canvas: { 
    icon: BookOpen, 
    label: "Canvas", 
    className: "source-badge-canvas" 
  },
  calendar: { 
    icon: Calendar, 
    label: "Calendar", 
    className: "source-badge-calendar" 
  },
  email: { 
    icon: Mail, 
    label: "Email", 
    className: "source-badge-email" 
  },
  events: { 
    icon: GraduationCap, 
    label: "Campus Events", 
    className: "source-badge-events" 
  },
};

export function SourceBadge({ type, className }: SourceBadgeProps) {
  const config = sourceConfig[type];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      config.className,
      className
    )}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
