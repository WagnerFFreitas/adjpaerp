import { Users, DollarSign, Calendar, Heart, TrendingUp, Church } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const proximosEventos = [
  { id: 1, titulo: "Culto de Celebração", data: "Domingo, 10:00", local: "Templo Principal" },
  { id: 2, titulo: "Reunião de Oração", data: "Quarta, 19:30", local: "Sala de Oração" },
  { id: 3, titulo: "Escola Bíblica", data: "Domingo, 09:00", local: "Salas de Aula" },
  { id: 4, titulo: "Culto de Jovens", data: "Sábado, 19:00", local: "Templo Principal" },
];

const aniversariantes = [
  { id: 1, nome: "Maria Silva", data: "Hoje" },
  { id: 2, nome: "João Santos", data: "Amanhã" },
  { id: 3, nome: "Ana Costa", data: "15/01" },
  { id: 4, nome: "Pedro Oliveira", data: "18/01" },
];

export default function IgrejaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Administração da Igreja</h1>
        <p className="page-subtitle">
          Gerencie membros, finanças e eventos da congregação
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Membros"
          value={328}
          change="+12 este mês"
          changeType="positive"
          icon={Users}
          iconColor="secondary"
        />
        <StatCard
          title="Batizados"
          value={245}
          change="74,7% dos membros"
          changeType="neutral"
          icon={Heart}
          iconColor="info"
        />
        <StatCard
          title="Dízimos do Mês"
          value="R$ 45.320"
          change="+8,5% vs anterior"
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Eventos do Mês"
          value={12}
          change="4 nesta semana"
          changeType="neutral"
          icon={Calendar}
          iconColor="warning"
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/igreja/membros")}
        >
          <Users className="w-6 h-6 text-primary" />
          <span>Membros</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/igreja/financeiro")}
        >
          <DollarSign className="w-6 h-6 text-success" />
          <span>Financeiro</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/igreja/eventos")}
        >
          <Calendar className="w-6 h-6 text-warning" />
          <span>Eventos</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2"
          onClick={() => navigate("/igreja/vida-crista")}
        >
          <Church className="w-6 h-6 text-secondary" />
          <span>Vida Cristã</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Próximos Eventos</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/igreja/eventos")}>
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {proximosEventos.map((evento) => (
              <div
                key={evento.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{evento.titulo}</p>
                  <p className="text-sm text-muted-foreground">{evento.data}</p>
                </div>
                <span className="text-xs text-muted-foreground">{evento.local}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aniversariantes */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Aniversariantes</h3>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {aniversariantes.map((pessoa) => (
              <div
                key={pessoa.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{pessoa.nome}</p>
                </div>
                <span className={`text-sm font-medium ${pessoa.data === "Hoje" ? "text-secondary" : "text-muted-foreground"}`}>
                  {pessoa.data}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold">Resumo Financeiro</h3>
          <Button variant="outline" size="sm" onClick={() => navigate("/igreja/financeiro")}>
            Ver Detalhes
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/10">
            <p className="text-sm text-muted-foreground mb-1">Dízimos</p>
            <p className="text-2xl font-bold text-success">R$ 32.450</p>
          </div>
          <div className="p-4 rounded-xl bg-info/5 border border-info/10">
            <p className="text-sm text-muted-foreground mb-1">Ofertas</p>
            <p className="text-2xl font-bold text-info">R$ 8.720</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/10">
            <p className="text-sm text-muted-foreground mb-1">Campanhas</p>
            <p className="text-2xl font-bold text-warning">R$ 4.150</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">Total Mês</p>
            <p className="text-2xl font-bold text-primary">R$ 45.320</p>
          </div>
        </div>
      </div>
    </div>
  );
}
