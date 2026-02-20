import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const resumoFinanceiro = {
  saldoAtual: 45780.50,
  receitasMes: 32500.00,
  despesasMes: 18450.00,
  contasPagarVencidas: 3,
  contasPagarHoje: 2,
  contasReceberHoje: 4,
};

const ultimasMovimentacoes = [
  { id: 1, descricao: "Pagamento Fornecedor A", tipo: "saida", valor: 2500.00, data: "28/01/2026", categoria: "Fornecedores" },
  { id: 2, descricao: "Dízimos - Culto Domingo", tipo: "entrada", valor: 8500.00, data: "27/01/2026", categoria: "Dízimos" },
  { id: 3, descricao: "Conta de Luz", tipo: "saida", valor: 850.00, data: "26/01/2026", categoria: "Utilidades" },
  { id: 4, descricao: "Ofertas Especiais", tipo: "entrada", valor: 3200.00, data: "25/01/2026", categoria: "Ofertas" },
  { id: 5, descricao: "Manutenção Equipamentos", tipo: "saida", valor: 1200.00, data: "24/01/2026", categoria: "Manutenção" },
];

const contasVencendo = [
  { id: 1, fornecedor: "Empresa de Limpeza", valor: 1500.00, vencimento: "28/01/2026", status: "vencendo" },
  { id: 2, fornecedor: "Internet Provider", valor: 350.00, vencimento: "30/01/2026", status: "pendente" },
  { id: 3, fornecedor: "Aluguel", valor: 5000.00, vencimento: "01/02/2026", status: "pendente" },
];

export default function FinanceiroDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Financeiro</h1>
          <p className="page-subtitle">
            Visão geral das finanças e movimentações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/financeiro/contas-pagar")}>
            <CreditCard className="w-4 h-4" />
            Contas a Pagar
          </Button>
          <Button variant="gradient" onClick={() => navigate("/financeiro/caixa")}>
            <Wallet className="w-4 h-4" />
            Abrir Caixa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {resumoFinanceiro.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Consolidado de todas as contas
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas do Mês
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {resumoFinanceiro.receitasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="w-3 h-3" />
              +12% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas do Mês
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {resumoFinanceiro.despesasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <ArrowDownRight className="w-3 h-3" />
              -5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contas Vencidas
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {resumoFinanceiro.contasPagarVencidas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requer atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Movimentações */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Últimas Movimentações</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/financeiro/movimentacoes")}>
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimasMovimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      mov.tipo === 'entrada' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {mov.tipo === 'entrada' ? (
                        <ArrowUpRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{mov.descricao}</p>
                      <p className="text-xs text-muted-foreground">{mov.categoria} • {mov.data}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    mov.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                  }`}>
                    {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contas a Vencer */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Contas a Vencer</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/financeiro/contas-pagar")}>
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contasVencendo.map((conta) => (
                <div key={conta.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{conta.fornecedor}</p>
                      <p className="text-xs text-muted-foreground">Vence em {conta.vencimento}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <Badge className={conta.status === 'vencendo' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}>
                      {conta.status === 'vencendo' ? 'Vence Hoje' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/financeiro/contas-pagar/nova")}>
              <CreditCard className="w-6 h-6" />
              <span>Nova Conta a Pagar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/financeiro/contas-receber/nova")}>
              <PiggyBank className="w-6 h-6" />
              <span>Nova Conta a Receber</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/financeiro/tipos-pagamento")}>
              <DollarSign className="w-6 h-6" />
              <span>Tipos de Pagamento</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate("/financeiro/relatorios")}>
              <TrendingUp className="w-6 h-6" />
              <span>Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
