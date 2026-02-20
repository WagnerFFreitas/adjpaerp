import {
  Calculator,
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const encargos = {
  inss: {
    empresa: 8250.00,
    funcionarios: 2475.00,
    total: 10725.00,
    vencimento: "20/02/2026",
    status: "Pendente",
  },
  fgts: {
    valor: 2640.00,
    vencimento: "07/02/2026",
    status: "Pendente",
  },
  irrf: {
    valor: 1890.00,
    vencimento: "20/02/2026",
    status: "Pendente",
  },
  rat: {
    valor: 660.00,
    aliquota: 2,
    vencimento: "20/02/2026",
    status: "Pendente",
  },
};

const historicoEncargos = [
  { competencia: "Dezembro/2025", inss: 10500, fgts: 2580, irrf: 1750, rat: 645, total: 15475, status: "Pago" },
  { competencia: "Novembro/2025", inss: 10350, fgts: 2540, irrf: 1720, rat: 635, total: 15245, status: "Pago" },
  { competencia: "Outubro/2025", inss: 10200, fgts: 2500, irrf: 1690, rat: 625, total: 15015, status: "Pago" },
  { competencia: "Setembro/2025", inss: 10100, fgts: 2480, irrf: 1680, rat: 620, total: 14880, status: "Pago" },
  { competencia: "Agosto/2025", inss: 9950, fgts: 2440, irrf: 1650, rat: 610, total: 14650, status: "Pago" },
];

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  status,
  variant = "default",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  status?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) => {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };

  const statusColors: Record<string, string> = {
    "Pago": "bg-success/10 text-success",
    "Pendente": "bg-warning/10 text-warning",
    "Atrasado": "bg-destructive/10 text-destructive",
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${variants[variant]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {status && (
          <Badge className={statusColors[status]}>{status}</Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export default function Encargos() {
  const totalEncargos = encargos.inss.total + encargos.fgts.valor + encargos.irrf.valor + encargos.rat.valor;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Encargos Sociais</h1>
          <p className="page-subtitle">INSS, FGTS, IRRF e RAT - Competência Janeiro/2026</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="janeiro">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Competência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="janeiro">Janeiro/2026</SelectItem>
              <SelectItem value="dezembro">Dezembro/2025</SelectItem>
              <SelectItem value="novembro">Novembro/2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="INSS Total"
          value={formatCurrency(encargos.inss.total)}
          icon={FileText}
          description={`Vence em ${encargos.inss.vencimento}`}
          status={encargos.inss.status}
          variant="default"
        />
        <StatCard
          title="FGTS"
          value={formatCurrency(encargos.fgts.valor)}
          icon={DollarSign}
          description={`Vence em ${encargos.fgts.vencimento}`}
          status={encargos.fgts.status}
          variant="success"
        />
        <StatCard
          title="IRRF"
          value={formatCurrency(encargos.irrf.valor)}
          icon={Calculator}
          description={`Vence em ${encargos.irrf.vencimento}`}
          status={encargos.irrf.status}
          variant="warning"
        />
        <StatCard
          title="RAT (2%)"
          value={formatCurrency(encargos.rat.valor)}
          icon={AlertCircle}
          description={`Vence em ${encargos.rat.vencimento}`}
          status={encargos.rat.status}
        />
      </div>

      {/* Total Card */}
      <div className="card-elevated p-6 gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80">Total de Encargos - Janeiro/2026</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(totalEncargos)}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80">Próximo vencimento</p>
            <p className="text-xl font-semibold">07/02/2026</p>
            <p className="text-sm text-primary-foreground/80">FGTS</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="inss">INSS</TabsTrigger>
          <TabsTrigger value="fgts">FGTS</TabsTrigger>
          <TabsTrigger value="irrf">IRRF</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INSS Breakdown */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Composição do INSS
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Parte Empresa (20%)</span>
                    <span className="font-medium">{formatCurrency(encargos.inss.empresa)}</span>
                  </div>
                  <Progress value={77} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Parte Funcionários (7.5% - 14%)</span>
                    <span className="font-medium">{formatCurrency(encargos.inss.funcionarios)}</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total INSS</span>
                    <span className="font-bold text-lg">{formatCurrency(encargos.inss.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vencimentos */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-warning" />
                Calendário de Vencimentos
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">FGTS</p>
                      <p className="text-sm text-muted-foreground">07/02/2026</p>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(encargos.fgts.valor)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">INSS / IRRF / RAT</p>
                      <p className="text-sm text-muted-foreground">20/02/2026</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(encargos.inss.total + encargos.irrf.valor + encargos.rat.valor)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inss">
          <div className="card-elevated p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Detalhamento do INSS</h3>
            <p className="text-muted-foreground">
              Visualize o cálculo detalhado do INSS por funcionário.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="fgts">
          <div className="card-elevated p-8 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Detalhamento do FGTS</h3>
            <p className="text-muted-foreground">
              Visualize os depósitos de FGTS por funcionário.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="irrf">
          <div className="card-elevated p-8 text-center">
            <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Detalhamento do IRRF</h3>
            <p className="text-muted-foreground">
              Visualize a retenção de IR na fonte por funcionário.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="card-elevated overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Competência</TableHead>
                  <TableHead className="text-right">INSS</TableHead>
                  <TableHead className="text-right">FGTS</TableHead>
                  <TableHead className="text-right">IRRF</TableHead>
                  <TableHead className="text-right">RAT</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoEncargos.map((item, index) => (
                  <TableRow key={index} className="table-row-hover">
                    <TableCell className="font-medium">{item.competencia}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.inss)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.fgts)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.irrf)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.rat)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
