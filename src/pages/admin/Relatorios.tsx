import { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Printer,
  Mail,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  ultimaGeracao: string;
  icon: React.ElementType;
}

const relatoriosRH: Relatorio[] = [
  {
    id: "1",
    nome: "Folha de Pagamento",
    descricao: "Relatório completo da folha mensal com todos os proventos e descontos",
    categoria: "RH",
    ultimaGeracao: "2024-01-10",
    icon: DollarSign,
  },
  {
    id: "2",
    nome: "Funcionários Ativos",
    descricao: "Lista de todos os funcionários ativos com dados contratuais",
    categoria: "RH",
    ultimaGeracao: "2024-01-12",
    icon: Users,
  },
  {
    id: "3",
    nome: "Férias e Afastamentos",
    descricao: "Controle de férias vencidas, a vencer e programadas",
    categoria: "RH",
    ultimaGeracao: "2024-01-08",
    icon: Calendar,
  },
  {
    id: "4",
    nome: "Encargos Sociais",
    descricao: "Resumo de INSS, FGTS, IRRF e demais encargos",
    categoria: "RH",
    ultimaGeracao: "2024-01-05",
    icon: FileText,
  },
];

const relatoriosIgreja: Relatorio[] = [
  {
    id: "5",
    nome: "Membros por Ministério",
    descricao: "Distribuição de membros por ministério e cargo",
    categoria: "Igreja",
    ultimaGeracao: "2024-01-11",
    icon: Users,
  },
  {
    id: "6",
    nome: "Dízimos e Ofertas",
    descricao: "Relatório financeiro de entradas (dízimos, ofertas, doações)",
    categoria: "Igreja",
    ultimaGeracao: "2024-01-14",
    icon: DollarSign,
  },
  {
    id: "7",
    nome: "Prestação de Contas",
    descricao: "Demonstrativo de receitas e despesas para assembleia",
    categoria: "Igreja",
    ultimaGeracao: "2024-01-01",
    icon: BarChart3,
  },
  {
    id: "8",
    nome: "Batismos e Casamentos",
    descricao: "Registro de cerimônias realizadas no período",
    categoria: "Igreja",
    ultimaGeracao: "2024-01-09",
    icon: FileText,
  },
];

const relatoriosGerenciais: Relatorio[] = [
  {
    id: "9",
    nome: "Dashboard Executivo",
    descricao: "Visão consolidada de todos os indicadores principais",
    categoria: "Gerencial",
    ultimaGeracao: "2024-01-15",
    icon: PieChart,
  },
  {
    id: "10",
    nome: "Comparativo Mensal",
    descricao: "Análise comparativa mês a mês dos principais indicadores",
    categoria: "Gerencial",
    ultimaGeracao: "2024-01-13",
    icon: TrendingUp,
  },
  {
    id: "11",
    nome: "Patrimônio",
    descricao: "Inventário completo de bens e equipamentos",
    categoria: "Gerencial",
    ultimaGeracao: "2024-01-07",
    icon: BarChart3,
  },
  {
    id: "12",
    nome: "Log de Auditoria",
    descricao: "Registro de todas as ações realizadas no sistema",
    categoria: "Gerencial",
    ultimaGeracao: "2024-01-15",
    icon: FileText,
  },
];

const historico = [
  { nome: "Folha de Pagamento - Janeiro/2024", data: "15/01/2024 14:32", usuario: "Maria Silva", formato: "PDF" },
  { nome: "Prestação de Contas - 2023", data: "14/01/2024 10:15", usuario: "Pr. Carlos", formato: "PDF" },
  { nome: "Membros por Ministério", data: "13/01/2024 16:45", usuario: "Admin", formato: "Excel" },
  { nome: "Encargos Sociais - Dezembro/2023", data: "12/01/2024 09:20", usuario: "Maria Silva", formato: "PDF" },
];

function RelatorioCard({ relatorio }: { relatorio: Relatorio }) {
  const Icon = relatorio.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{relatorio.nome}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {relatorio.descricao}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Última geração: {new Date(relatorio.ultimaGeracao).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("mes");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Relatórios
          </h1>
          <p className="text-muted-foreground">
            Central de geração de relatórios e documentos
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="semestre">Este Semestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Relatórios Disponíveis"
          value="12"
          icon={FileText}
          description="Modelos prontos"
          trend="neutral"
        />
        <StatCard
          title="Gerados este Mês"
          value="45"
          icon={Download}
          description="Downloads realizados"
          trend="up"
          trendValue="+12"
        />
        <StatCard
          title="Agendados"
          value="3"
          icon={Calendar}
          description="Envio automático"
          trend="neutral"
        />
        <StatCard
          title="Mais Usado"
          value="Folha"
          icon={TrendingUp}
          description="Relatório mais acessado"
          trend="neutral"
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Gerar Relatório</p>
              <p className="text-sm text-muted-foreground">Criar novo relatório</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Agendar Envio</p>
              <p className="text-sm text-muted-foreground">Automático por e-mail</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Printer className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Imprimir</p>
              <p className="text-sm text-muted-foreground">Enviar para impressora</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-medium">Enviar por E-mail</p>
              <p className="text-sm text-muted-foreground">Compartilhar relatório</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="rh">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rh">RH / DP</TabsTrigger>
          <TabsTrigger value="igreja">Igreja</TabsTrigger>
          <TabsTrigger value="gerencial">Gerenciais</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="rh" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {relatoriosRH.map((rel) => (
              <RelatorioCard key={rel.id} relatorio={rel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="igreja" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {relatoriosIgreja.map((rel) => (
              <RelatorioCard key={rel.id} relatorio={rel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gerencial" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {relatoriosGerenciais.map((rel) => (
              <RelatorioCard key={rel.id} relatorio={rel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Geração</CardTitle>
              <CardDescription>Últimos relatórios gerados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historico.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Gerado por {item.usuario}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p>{item.data}</p>
                        <Badge variant="outline">{item.formato}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
