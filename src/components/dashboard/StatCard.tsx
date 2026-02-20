import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "secondary" | "success" | "warning" | "info";
  description?: string;
  trend?: string;
  trendValue?: string;
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

const changeClasses = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  description,
  trend,
  trendValue,
}: StatCardProps) {
  const displayChange = change || (trendValue ? `${trend || ''} ${trendValue}`.trim() : trend);
  const inferredChangeType = changeType !== "neutral" ? changeType : 
    (trend?.includes("+") || trend?.includes("↑") ? "positive" : 
     trend?.includes("-") || trend?.includes("↓") ? "negative" : "neutral");

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {displayChange && (
            <p className={cn("text-sm mt-2", changeClasses[inferredChangeType])}>
              {displayChange}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColorClasses[iconColor])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
