import { useState } from "react";
import { 
  DollarSign, 
  FileText, 
  Download, 
  CheckCircle,
  Clock,
  Calculator,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";
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

interface FuncionarioFolha {
  id: string;
  nome: string;
  cargo: string;
  salarioBruto: number;
  descontos: number;
  liquido: number;
  status: "calculado" | "aprovado" | "pago";
}

const funcionariosFolha: FuncionarioFolha[] = [
  { id: "1", nome: "Maria Silva", cargo: "Secretária", salarioBruto: 3500, descontos: 567.50, liquido: 2932.50, status: "aprovado" },
  { id: "2", nome: "João Santos", cargo: "Zelador", salarioBruto: 2200, descontos: 264, liquido: 1936, status: "aprovado" },
  { id: "3", nome: "Ana Costa", cargo: "Recepcionista", salarioBruto: 2800, descontos: 392, liquido: 2408, status: "calculado" },
  { id: "4", nome: "Pedro Oliveira", cargo: "Motorista", salarioBruto: 3200, descontos: 480, liquido: 2720, status: "pago" },
  { id: "5", nome: "Lucas Ferreira", cargo: "Auxiliar Administrativo", salarioBruto: 2500, descontos: 325, liquido: 2175, status: "calculado" },
];

const resumoFolha = {
  totalBruto: 85420.00,
  totalDescontos: 12813.00,
  totalLiquido: 72607.00,
  inss: 7633.80,
  irrf: 3456.20,
  fgts: 6833.60,
  totalFuncionarios: 25,
  folhasCalculadas: 20,
  folhasAprovadas: 15,
  folhasPagas: 10,
};

const statusColors: Record<string, string> = {
  calculado: "bg-yellow-100 text-yellow-800",
  aprovado: "bg-blue-100 text-blue-800",
  pago: "bg-green-100 text-green-800",
};

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function FolhaPagamento() {
  const [mesSelecionado, setMesSelecionado] = useState("01");
  const [anoSelecionado, setAnoSelecionado] = useState("2024");

  const progressoFolha = (resumoFolha.folhasPagas / resumoFolha.totalFuncionarios) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Folha de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Gestão e fechamento da folha mensal
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes, index) => (
                <SelectItem key={index} value={String(index + 1).padStart(2, "0")}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Bruto"
          value={`R$ ${resumoFolha.totalBruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="Salários + adicionais"
          trend="up"
          trendValue="+3.5%"
        />
        <StatCard
          title="Total Descontos"
          value={`R$ ${resumoFolha.totalDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={Calculator}
          description="INSS + IRRF + outros"
          trend="neutral"
        />
        <StatCard
          title="Total Líquido"
          value={`R$ ${resumoFolha.totalLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          description="Valor a pagar"
          trend="up"
          trendValue="+2.8%"
        />
        <StatCard
          title="Funcionários"
          value={resumoFolha.totalFuncionarios.toString()}
          icon={Users}
          description="Na folha deste mês"
          trend="neutral"
        />
      </div>

      {/* Progresso da Folha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Progresso do Fechamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Folhas processadas</span>
              <span className="font-medium">
                {resumoFolha.folhasPagas} de {resumoFolha.totalFuncionarios}
              </span>
            </div>
            <Progress value={progressoFolha} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>{resumoFolha.folhasCalculadas - resumoFolha.folhasAprovadas} calculadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>{resumoFolha.folhasAprovadas - resumoFolha.folhasPagas} aprovadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>{resumoFolha.folhasPagas} pagas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button className="h-auto py-4 flex flex-col gap-2 gradient-gold text-primary-foreground">
          <Calculator className="w-6 h-6" />
          <span>Calcular Folha</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <CheckCircle className="w-6 h-6" />
          <span>Aprovar Folhas</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <DollarSign className="w-6 h-6" />
          <span>Processar Pagamentos</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
          <Download className="w-6 h-6" />
          <span>Exportar Relatório</span>
        </Button>
      </div>

      {/* Resumo de Encargos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">INSS Patronal</p>
                <p className="text-2xl font-bold">
                  R$ {resumoFolha.inss.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Vencimento: 20/02/2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IRRF</p>
                <p className="text-2xl font-bold">
                  R$ {resumoFolha.irrf.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Vencimento: 20/02/2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">FGTS</p>
                <p className="text-2xl font-bold">
                  R$ {resumoFolha.fgts.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Vencimento: 07/02/2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Funcionários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhamento por Funcionário</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Bruto</TableHead>
                <TableHead className="text-right">Descontos</TableHead>
                <TableHead className="text-right">Líquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionariosFolha.map((func) => (
                <TableRow key={func.id}>
                  <TableCell className="font-medium">{func.nome}</TableCell>
                  <TableCell>{func.cargo}</TableCell>
                  <TableCell className="text-right">
                    R$ {func.salarioBruto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    -R$ {func.descontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {func.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[func.status]}>
                      {func.status === "calculado" && "Calculado"}
                      {func.status === "aprovado" && "Aprovado"}
                      {func.status === "pago" && "Pago"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
