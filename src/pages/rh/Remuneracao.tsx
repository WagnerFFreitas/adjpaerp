import { useState } from "react";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Award,
  Gift,
  Plus,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const funcionariosRemuneracao = [
  {
    id: 1,
    nome: "Maria Silva Santos",
    cargo: "Analista Financeiro",
    salarioBase: 5500,
    adicionais: 550,
    beneficios: 1200,
    totalBruto: 7250,
    descontos: 1087.5,
    totalLiquido: 6162.5,
  },
  {
    id: 2,
    nome: "João Pedro Costa",
    cargo: "Desenvolvedor",
    salarioBase: 8200,
    adicionais: 820,
    beneficios: 1500,
    totalBruto: 10520,
    descontos: 1578,
    totalLiquido: 8942,
  },
  {
    id: 3,
    nome: "Ana Carolina Lima",
    cargo: "Secretária",
    salarioBase: 3200,
    adicionais: 0,
    beneficios: 800,
    totalBruto: 4000,
    descontos: 600,
    totalLiquido: 3400,
  },
  {
    id: 4,
    nome: "Carlos Eduardo Souza",
    cargo: "Contador",
    salarioBase: 7800,
    adicionais: 1560,
    beneficios: 0,
    totalBruto: 9360,
    descontos: 0,
    totalLiquido: 9360,
  },
  {
    id: 5,
    nome: "Fernanda Oliveira",
    cargo: "Estagiária",
    salarioBase: 1800,
    adicionais: 0,
    beneficios: 400,
    totalBruto: 2200,
    descontos: 0,
    totalLiquido: 2200,
  },
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
  variant = "default",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  variant?: "default" | "success" | "warning";
}) => {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${variants[variant]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default function Remuneracao() {
  const [searchTerm, setSearchTerm] = useState("");

  const totalFolha = funcionariosRemuneracao.reduce((acc, f) => acc + f.totalBruto, 0);
  const totalLiquido = funcionariosRemuneracao.reduce((acc, f) => acc + f.totalLiquido, 0);
  const totalBeneficios = funcionariosRemuneracao.reduce((acc, f) => acc + f.beneficios, 0);
  const totalAdicionais = funcionariosRemuneracao.reduce((acc, f) => acc + f.adicionais, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Remuneração</h1>
          <p className="page-subtitle">Gerencie salários, adicionais e benefícios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="w-4 h-4" />
            Simular Folha
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Folha Bruta"
          value={formatCurrency(totalFolha)}
          icon={DollarSign}
          description="Competência atual"
          variant="default"
        />
        <StatCard
          title="Total Líquido"
          value={formatCurrency(totalLiquido)}
          icon={TrendingUp}
          description="Após descontos"
          variant="success"
        />
        <StatCard
          title="Total Benefícios"
          value={formatCurrency(totalBeneficios)}
          icon={Gift}
          description="VR, VT, Plano de Saúde"
        />
        <StatCard
          title="Total Adicionais"
          value={formatCurrency(totalAdicionais)}
          icon={Award}
          description="H.E., Gratificações"
          variant="warning"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="salarios">Salários</TabsTrigger>
          <TabsTrigger value="adicionais">Adicionais</TabsTrigger>
          <TabsTrigger value="beneficios">Benefícios</TabsTrigger>
          <TabsTrigger value="horas-extras">Horas Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          {/* Filters */}
          <div className="card-elevated p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="todos">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="ti">TI</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="janeiro">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Competência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janeiro">Janeiro/2026</SelectItem>
                  <SelectItem value="dezembro">Dezembro/2025</SelectItem>
                  <SelectItem value="novembro">Novembro/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="card-elevated overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Salário Base</TableHead>
                  <TableHead className="text-right">Adicionais</TableHead>
                  <TableHead className="text-right">Benefícios</TableHead>
                  <TableHead className="text-right">Total Bruto</TableHead>
                  <TableHead className="text-right">Descontos</TableHead>
                  <TableHead className="text-right">Total Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionariosRemuneracao.map((func) => (
                  <TableRow key={func.id} className="table-row-hover">
                    <TableCell className="font-medium">{func.nome}</TableCell>
                    <TableCell>{func.cargo}</TableCell>
                    <TableCell className="text-right">{formatCurrency(func.salarioBase)}</TableCell>
                    <TableCell className="text-right text-success">
                      {func.adicionais > 0 ? `+${formatCurrency(func.adicionais)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {func.beneficios > 0 ? formatCurrency(func.beneficios) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(func.totalBruto)}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {func.descontos > 0 ? `-${formatCurrency(func.descontos)}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-success">
                      {formatCurrency(func.totalLiquido)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="card-elevated p-4">
            <div className="flex justify-end gap-8">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Folha Bruta</p>
                <p className="text-xl font-bold">{formatCurrency(totalFolha)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Líquido</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalLiquido)}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="salarios">
          <div className="card-elevated p-8 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestão de Salários</h3>
            <p className="text-muted-foreground">
              Configure salários base, reajustes e histórico salarial.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="adicionais">
          <div className="card-elevated p-8 text-center">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Adicionais e Gratificações</h3>
            <p className="text-muted-foreground">
              Gerencie comissões, prêmios, gratificações e outros adicionais.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="beneficios">
          <div className="card-elevated p-8 text-center">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pacote de Benefícios</h3>
            <p className="text-muted-foreground">
              Configure VR, VT, plano de saúde, odontológico e outros benefícios.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="horas-extras">
          <div className="card-elevated p-8 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Controle de Horas Extras</h3>
            <p className="text-muted-foreground">
              Registre e calcule horas extras, adicional noturno e DSR.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
