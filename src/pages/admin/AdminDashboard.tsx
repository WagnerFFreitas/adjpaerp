import { Users, Shield, Database, FileText, Settings, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const usuariosRecentes = [
  { id: 1, nome: "Admin Sistema", perfil: "Administrador Geral", ultimoAcesso: "Agora" },
  { id: 2, nome: "Maria RH", perfil: "RH", ultimoAcesso: "Há 5 min" },
  { id: 3, nome: "João Financeiro", perfil: "Financeiro", ultimoAcesso: "Há 1 hora" },
  { id: 4, nome: "Pastor Silva", perfil: "Pastor", ultimoAcesso: "Há 2 horas" },
];

const logsAuditoria = [
  { id: 1, acao: "Login", usuario: "Admin Sistema", data: "11/01/2024 10:30" },
  { id: 2, acao: "Cadastro Funcionário", usuario: "Maria RH", data: "11/01/2024 09:45" },
  { id: 3, acao: "Lançamento Dízimo", usuario: "João Financeiro", data: "11/01/2024 09:15" },
  { id: 4, acao: "Edição Membro", usuario: "Pastor Silva", data: "10/01/2024 18:20" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Controle Administrativo</h1>
        <p className="page-subtitle">
          Gestão de usuários, permissões e configurações do sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuários Ativos"
          value={12}
          change="3 online agora"
          changeType="positive"
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Perfis de Acesso"
          value={6}
          change="Configurados"
          changeType="neutral"
          icon={Shield}
          iconColor="warning"
        />
        <StatCard
          title="Itens de Patrimônio"
          value={156}
          change="R$ 485.000 em ativos"
          changeType="neutral"
          icon={Database}
          iconColor="info"
        />
        <StatCard
          title="Logs de Auditoria"
          value="1.245"
          change="Últimos 30 dias"
          changeType="neutral"
          icon={Activity}
          iconColor="success"
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/admin/obreiros")}
        >
          <Users className="w-5 h-5 text-secondary" />
          <span className="text-sm">Obreiros e Pastores</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/admin/patrimonio")}
        >
          <Database className="w-5 h-5 text-info" />
          <span className="text-sm">Patrimônio</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/admin/usuarios")}
        >
          <Shield className="w-5 h-5 text-warning" />
          <span className="text-sm">Usuários</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/admin/relatorios")}
        >
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm">Relatórios</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários Recentes */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Usuários Ativos</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/usuarios")}>
              Gerenciar
            </Button>
          </div>
          <div className="space-y-3">
            {usuariosRecentes.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{usuario.nome}</p>
                    <p className="text-xs text-muted-foreground">{usuario.perfil}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {usuario.ultimoAcesso}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Logs de Auditoria */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Logs de Auditoria</h3>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {logsAuditoria.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{log.acao}</p>
                    <p className="text-xs text-muted-foreground">{log.usuario}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.data}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perfis de Acesso */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Perfis de Acesso</h3>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { nome: "Administrador Geral", usuarios: 2, cor: "primary" },
            { nome: "RH", usuarios: 3, cor: "success" },
            { nome: "Financeiro", usuarios: 2, cor: "warning" },
            { nome: "Secretaria", usuarios: 2, cor: "info" },
            { nome: "Pastor", usuarios: 2, cor: "secondary" },
            { nome: "Usuário Leitura", usuarios: 1, cor: "muted" },
          ].map((perfil, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
            >
              <div className={`w-12 h-12 rounded-full bg-${perfil.cor}/10 flex items-center justify-center mx-auto mb-2`}>
                <Shield className={`w-6 h-6 text-${perfil.cor}`} />
              </div>
              <p className="font-medium text-sm">{perfil.nome}</p>
              <p className="text-xs text-muted-foreground">{perfil.usuarios} usuários</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
