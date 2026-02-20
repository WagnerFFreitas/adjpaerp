import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Download,
  Filter,
  Heart,
  Gift,
  Target,
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  variant?: "default" | "success" | "danger" | "gold";
}) => {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    danger: "bg-destructive/10 text-destructive",
    gold: "bg-secondary/10 text-secondary",
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === "up" ? "text-success" : "text-destructive"}`}>
              {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${variants[variant]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const lancamentos = [
  { id: 1, data: "10/01/2026", tipo: "Dízimo", membro: "José Carlos", valor: 500, status: "Confirmado" },
  { id: 2, data: "10/01/2026", tipo: "Oferta", membro: "Maria Fernanda", valor: 150, status: "Confirmado" },
  { id: 3, data: "10/01/2026", tipo: "Campanha", membro: "Pedro Henrique", valor: 200, status: "Pendente" },
  { id: 4, data: "09/01/2026", tipo: "Dízimo", membro: "Ana Paula", valor: 800, status: "Confirmado" },
  { id: 5, data: "09/01/2026", tipo: "Despesa", membro: "Conta de Luz", valor: -450, status: "Pago" },
  { id: 6, data: "08/01/2026", tipo: "Despesa", membro: "Aluguel", valor: -2500, status: "Pago" },
  { id: 7, data: "08/01/2026", tipo: "Oferta", membro: "Anônimo", valor: 100, status: "Confirmado" },
];

const tipoColors: Record<string, string> = {
  "Dízimo": "bg-success/10 text-success border-success/20",
  "Oferta": "bg-primary/10 text-primary border-primary/20",
  "Campanha": "bg-secondary/10 text-secondary border-secondary/20",
  "Despesa": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Financeiro() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Financeiro da Igreja</h1>
          <p className="page-subtitle">Gerencie dízimos, ofertas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Relatório
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="w-4 h-4" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
                <DialogDescription>
                  Registre uma nova entrada ou saída financeira
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Lançamento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dizimo">Dízimo</SelectItem>
                      <SelectItem value="oferta">Oferta</SelectItem>
                      <SelectItem value="campanha">Campanha</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Membro / Descrição</Label>
                  <Input placeholder="Nome do membro ou descrição" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor *</Label>
                    <Input placeholder="R$ 0,00" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data *</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input placeholder="Observações opcionais" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="gold" onClick={() => setIsDialogOpen(false)}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Entradas do Mês"
          value="R$ 25.680,00"
          icon={TrendingUp}
          trend="up"
          trendValue="+12% vs mês anterior"
          variant="success"
        />
        <StatCard
          title="Saídas do Mês"
          value="R$ 18.450,00"
          icon={TrendingDown}
          trend="down"
          trendValue="-5% vs mês anterior"
          variant="danger"
        />
        <StatCard
          title="Saldo Atual"
          value="R$ 42.350,00"
          icon={Wallet}
          variant="default"
        />
        <StatCard
          title="Dízimos Recebidos"
          value="R$ 18.200,00"
          icon={Heart}
          trend="up"
          trendValue="+8% vs mês anterior"
          variant="gold"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dizimistas Ativos</p>
              <p className="text-xl font-bold">87</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ofertas este Mês</p>
              <p className="text-xl font-bold">156</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lancamentos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
          <TabsTrigger value="dizimos">Dízimos</TabsTrigger>
          <TabsTrigger value="ofertas">Ofertas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
        </TabsList>

        <TabsContent value="lancamentos" className="space-y-4">
          {/* Filters */}
          <div className="card-elevated p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Buscar por descrição..." />
              </div>
              <Select defaultValue="todos">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="dizimo">Dízimos</SelectItem>
                  <SelectItem value="oferta">Ofertas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="janeiro">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janeiro">Janeiro 2026</SelectItem>
                  <SelectItem value="dezembro">Dezembro 2025</SelectItem>
                  <SelectItem value="novembro">Novembro 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="card-elevated overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lancamentos.map((lancamento) => (
                  <TableRow key={lancamento.id} className="table-row-hover">
                    <TableCell>{lancamento.data}</TableCell>
                    <TableCell>
                      <Badge className={tipoColors[lancamento.tipo]}>
                        {lancamento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{lancamento.membro}</TableCell>
                    <TableCell className={`text-right font-medium ${lancamento.valor < 0 ? "text-destructive" : "text-success"}`}>
                      {lancamento.valor < 0 ? "-" : "+"} R$ {Math.abs(lancamento.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lancamento.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="dizimos">
          <div className="card-elevated p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestão de Dízimos</h3>
            <p className="text-muted-foreground">
              Acompanhe os dízimos recebidos, dizimistas fiéis e relatórios mensais.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ofertas">
          <div className="card-elevated p-8 text-center">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestão de Ofertas</h3>
            <p className="text-muted-foreground">
              Registre e acompanhe todas as ofertas recebidas nos cultos.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="despesas">
          <div className="card-elevated p-8 text-center">
            <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Controle de Despesas</h3>
            <p className="text-muted-foreground">
              Gerencie as despesas fixas e variáveis da igreja.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="campanhas">
          <div className="card-elevated p-8 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Campanhas de Arrecadação</h3>
            <p className="text-muted-foreground">
              Crie e acompanhe campanhas especiais de arrecadação.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
