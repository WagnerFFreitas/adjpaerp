import { UserPlus, DollarSign, FileCheck, Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "employee",
    title: "Novo funcionário cadastrado",
    description: "Maria Silva foi adicionada ao departamento Financeiro",
    time: "Há 2 horas",
    icon: UserPlus,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    id: 2,
    type: "tithe",
    title: "Dízimo registrado",
    description: "R$ 1.500,00 - João Santos",
    time: "Há 3 horas",
    icon: DollarSign,
    iconBg: "bg-success/10 text-success",
  },
  {
    id: 3,
    type: "document",
    title: "Documento gerado",
    description: "Folha de pagamento - Janeiro 2024",
    time: "Há 5 horas",
    icon: FileCheck,
    iconBg: "bg-info/10 text-info",
  },
  {
    id: 4,
    type: "event",
    title: "Evento agendado",
    description: "Culto de Celebração - Domingo",
    time: "Há 1 dia",
    icon: Calendar,
    iconBg: "bg-warning/10 text-warning",
  },
  {
    id: 5,
    type: "member",
    title: "Novo membro batizado",
    description: "Ana Costa - Batismo nas águas",
    time: "Há 2 dias",
    icon: Heart,
    iconBg: "bg-secondary/10 text-secondary",
  },
];

export function RecentActivity() {
  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Atividade Recente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn("p-2 rounded-lg", activity.iconBg)}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
