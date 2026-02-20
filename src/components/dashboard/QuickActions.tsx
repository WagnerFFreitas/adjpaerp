import { Button } from "@/components/ui/button";
import { UserPlus, FileText, DollarSign, Calendar, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Novo Funcionário",
    description: "Cadastrar colaborador",
    icon: UserPlus,
    href: "/funcionarios/novo",
    variant: "gradient" as const,
  },
  {
    title: "Novo Membro",
    description: "Cadastrar membro da igreja",
    icon: Heart,
    href: "/igreja/membros/novo",
    variant: "gold" as const,
  },
  {
    title: "Lançar Dízimo",
    description: "Registrar contribuição",
    icon: DollarSign,
    href: "/igreja/financeiro",
    variant: "default" as const,
  },
  {
    title: "Gerar Relatório",
    description: "Relatórios e documentos",
    icon: FileText,
    href: "/admin/relatorios",
    variant: "outline" as const,
  },
  {
    title: "Agendar Evento",
    description: "Criar novo evento",
    icon: Calendar,
    href: "/igreja/eventos",
    variant: "outline" as const,
  },
  {
    title: "Ver Funcionários",
    description: "Lista completa",
    icon: Users,
    href: "/funcionarios",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate(action.href)}
          >
            <action.icon className="w-5 h-5" />
            <div className="text-center">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs opacity-70">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
