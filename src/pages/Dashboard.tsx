import { Users, Church, DollarSign, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Bem-vindo ao GestãoPlus - Visão geral do seu sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Funcionários"
          value={47}
          change="+3 este mês"
          changeType="positive"
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Membros da Igreja"
          value={328}
          change="+12 este mês"
          changeType="positive"
          icon={Church}
          iconColor="secondary"
        />
        <StatCard
          title="Dízimos do Mês"
          value="R$ 45.320"
          change="+8,5% vs mês anterior"
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Eventos Agendados"
          value={8}
          change="Próximos 7 dias"
          changeType="neutral"
          icon={Calendar}
          iconColor="info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Takes 2 columns */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* Mini Stats */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Resumo Mensal</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Receitas</span>
              </div>
              <span className="font-bold text-success">R$ 68.450</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium">Despesas</span>
              </div>
              <span className="font-bold text-destructive">R$ 42.180</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="text-sm font-medium">Saldo</span>
              <span className="font-bold text-primary">R$ 26.270</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
