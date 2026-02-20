import { Users, DollarSign, Clock, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const pendencias = [
  { id: 1, tipo: "Férias", funcionario: "Maria Silva", vencimento: "Em 15 dias", prioridade: "alta" },
  { id: 2, tipo: "Exame Periódico", funcionario: "João Costa", vencimento: "Em 30 dias", prioridade: "media" },
  { id: 3, tipo: "Contrato Temporário", funcionario: "Ana Santos", vencimento: "Em 7 dias", prioridade: "alta" },
  { id: 4, tipo: "Avaliação", funcionario: "Pedro Lima", vencimento: "Esta semana", prioridade: "baixa" },
];

const folhaPagamento = [
  { descricao: "Salários", valor: "R$ 125.400,00" },
  { descricao: "INSS Patronal", valor: "R$ 25.080,00" },
  { descricao: "FGTS", valor: "R$ 10.032,00" },
  { descricao: "Benefícios", valor: "R$ 18.500,00" },
];

export default function RHDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Departamento Pessoal</h1>
        <p className="page-subtitle">
          Gestão de RH, folha de pagamento e encargos trabalhistas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Funcionários"
          value={47}
          change="CLT: 38 | PJ: 6 | Outros: 3"
          changeType="neutral"
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Folha Mensal"
          value="R$ 178.012"
          change="+3,2% vs mês anterior"
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Horas Extras"
          value="234h"
          change="Este mês"
          changeType="neutral"
          icon={Clock}
          iconColor="warning"
        />
        <StatCard
          title="Afastamentos"
          value={3}
          change="2 férias, 1 licença"
          changeType="neutral"
          icon={FileText}
          iconColor="info"
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/rh/trabalhista")}
        >
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm">Cadastro Trabalhista</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/rh/remuneracao")}
        >
          <DollarSign className="w-5 h-5 text-success" />
          <span className="text-sm">Remuneração</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/rh/encargos")}
        >
          <TrendingUp className="w-5 h-5 text-warning" />
          <span className="text-sm">Encargos</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/rh/afastamentos")}
        >
          <Clock className="w-5 h-5 text-info" />
          <span className="text-sm">Afastamentos</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/admin/relatorios")}
        >
          <FileText className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm">Relatórios</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendências */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Pendências
            </h3>
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {pendencias.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
              >
                <div>
                  <p className="font-medium text-sm">{item.tipo}</p>
                  <p className="text-sm text-muted-foreground">{item.funcionario}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      item.prioridade === "alta"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : item.prioridade === "media"
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {item.vencimento}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Folha */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">
              Resumo da Folha - Janeiro/2024
            </h3>
            <Button variant="ghost" size="sm">
              Detalhes
            </Button>
          </div>
          <div className="space-y-3">
            {folhaPagamento.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <span className="text-sm font-medium">{item.descricao}</span>
                <span className="font-bold">{item.valor}</span>
              </div>
            ))}
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">R$ 179.012,00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Encargos do Mês */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Encargos do Mês</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">INSS Patronal</p>
            <p className="text-2xl font-bold text-primary">R$ 25.080</p>
            <p className="text-xs text-muted-foreground mt-1">20% sobre folha</p>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/10">
            <p className="text-sm text-muted-foreground mb-1">FGTS</p>
            <p className="text-2xl font-bold text-success">R$ 10.032</p>
            <p className="text-xs text-muted-foreground mt-1">8% sobre salários</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/10">
            <p className="text-sm text-muted-foreground mb-1">RAT/SAT</p>
            <p className="text-2xl font-bold text-warning">R$ 2.508</p>
            <p className="text-xs text-muted-foreground mt-1">2% grau de risco</p>
          </div>
          <div className="p-4 rounded-xl bg-info/5 border border-info/10">
            <p className="text-sm text-muted-foreground mb-1">IRRF Retido</p>
            <p className="text-2xl font-bold text-info">R$ 8.450</p>
            <p className="text-xs text-muted-foreground mt-1">Conforme tabela</p>
          </div>
        </div>
      </div>
    </div>
  );
}
