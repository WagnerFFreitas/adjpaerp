import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  UserX,
  Plane,
  Baby,
  HeartPulse,
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Afastamento {
  id: string;
  funcionario: string;
  matricula: string;
  tipo: "ferias" | "licenca_medica" | "licenca_maternidade" | "licenca_paternidade" | "acidente_trabalho" | "auxilio_doenca" | "falta_justificada" | "falta_injustificada" | "licenca_casamento" | "licenca_obito" | "licenca_militar" | "suspensao" | "outros";
  dataInicio: string;
  dataFim: string;
  status: "em_andamento" | "agendado" | "concluido" | "cancelado";
  diasTotais: number;
  cid?: string;
  medico?: string;
  crm?: string;
  atestadoNumero?: string;
  dataAtestado?: string;
  observacao?: string;
}

const afastamentos: Afastamento[] = [
  {
    id: "1",
    funcionario: "Maria Silva",
    matricula: "001234",
    tipo: "ferias",
    dataInicio: "2024-01-15",
    dataFim: "2024-01-29",
    status: "em_andamento",
    diasTotais: 15,
  },
  {
    id: "2",
    funcionario: "João Santos",
    matricula: "001235",
    tipo: "licenca_medica",
    dataInicio: "2024-01-10",
    dataFim: "2024-01-20",
    status: "em_andamento",
    diasTotais: 10,
    cid: "J11",
    medico: "Dr. Carlos Mendes",
    crm: "12345-SP",
    atestadoNumero: "ATT-2024-0125",
    dataAtestado: "2024-01-10",
    observacao: "Influenza - Repouso recomendado",
  },
  {
    id: "3",
    funcionario: "Ana Costa",
    matricula: "001236",
    tipo: "licenca_maternidade",
    dataInicio: "2024-02-01",
    dataFim: "2024-05-31",
    status: "agendado",
    diasTotais: 120,
  },
  {
    id: "4",
    funcionario: "Pedro Oliveira",
    matricula: "001237",
    tipo: "ferias",
    dataInicio: "2024-02-10",
    dataFim: "2024-03-01",
    status: "agendado",
    diasTotais: 20,
  },
  {
    id: "5",
    funcionario: "Lucas Ferreira",
    matricula: "001238",
    tipo: "licenca_paternidade",
    dataInicio: "2023-12-15",
    dataFim: "2023-12-19",
    status: "concluido",
    diasTotais: 5,
  },
  {
    id: "6",
    funcionario: "Roberto Almeida",
    matricula: "001239",
    tipo: "acidente_trabalho",
    dataInicio: "2024-01-05",
    dataFim: "2024-02-05",
    status: "em_andamento",
    diasTotais: 31,
    cid: "S62.0",
    medico: "Dra. Paula Ribeiro",
    crm: "54321-SP",
    atestadoNumero: "ATT-2024-0098",
    dataAtestado: "2024-01-05",
    observacao: "Fratura no punho - Acidente de trabalho",
  },
];

const tipoLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  ferias: { label: "Férias", icon: Plane, color: "bg-blue-100 text-blue-800" },
  licenca_medica: { label: "Licença Médica", icon: HeartPulse, color: "bg-red-100 text-red-800" },
  licenca_maternidade: { label: "Licença Maternidade", icon: Baby, color: "bg-pink-100 text-pink-800" },
  licenca_paternidade: { label: "Licença Paternidade", icon: Baby, color: "bg-purple-100 text-purple-800" },
  acidente_trabalho: { label: "Acidente de Trabalho", icon: AlertTriangle, color: "bg-orange-100 text-orange-800" },
  auxilio_doenca: { label: "Auxílio Doença (INSS)", icon: HeartPulse, color: "bg-red-100 text-red-800" },
  falta_justificada: { label: "Falta Justificada", icon: FileText, color: "bg-yellow-100 text-yellow-800" },
  falta_injustificada: { label: "Falta Injustificada", icon: UserX, color: "bg-red-100 text-red-800" },
  licenca_casamento: { label: "Licença Casamento (Gala)", icon: Calendar, color: "bg-pink-100 text-pink-800" },
  licenca_obito: { label: "Licença Óbito (Nojo)", icon: FileText, color: "bg-gray-100 text-gray-800" },
  licenca_militar: { label: "Serviço Militar", icon: FileText, color: "bg-green-100 text-green-800" },
  suspensao: { label: "Suspensão", icon: UserX, color: "bg-red-100 text-red-800" },
  outros: { label: "Outros", icon: FileText, color: "bg-gray-100 text-gray-800" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  em_andamento: { label: "Em Andamento", color: "bg-green-100 text-green-800" },
  agendado: { label: "Agendado", color: "bg-yellow-100 text-yellow-800" },
  concluido: { label: "Concluído", color: "bg-gray-100 text-gray-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function Afastamentos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAfastamentos = afastamentos.filter((a) => {
    const matchSearch = a.funcionario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === "todos" || a.tipo === filterTipo;
    const matchStatus = filterStatus === "todos" || a.status === filterStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const emAndamento = afastamentos.filter((a) => a.status === "em_andamento").length;
  const agendados = afastamentos.filter((a) => a.status === "agendado").length;
  const feriasAcumuladas = 45; // Mock
  const licencasMes = 3;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Afastamentos
          </h1>
          <p className="text-muted-foreground">
            Controle de férias, licenças e afastamentos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Novo Afastamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Afastamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Funcionário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Maria Silva</SelectItem>
                    <SelectItem value="2">João Santos</SelectItem>
                    <SelectItem value="3">Ana Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Afastamento *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="licenca_medica">Licença Médica</SelectItem>
                    <SelectItem value="licenca_maternidade">Licença Maternidade (120 dias)</SelectItem>
                    <SelectItem value="licenca_paternidade">Licença Paternidade (5-20 dias)</SelectItem>
                    <SelectItem value="acidente_trabalho">Acidente de Trabalho</SelectItem>
                    <SelectItem value="auxilio_doenca">Auxílio Doença (INSS)</SelectItem>
                    <SelectItem value="falta_justificada">Falta Justificada</SelectItem>
                    <SelectItem value="falta_injustificada">Falta Injustificada</SelectItem>
                    <SelectItem value="licenca_casamento">Licença Casamento (Gala - 3 dias)</SelectItem>
                    <SelectItem value="licenca_obito">Licença Óbito (Nojo - 2 dias)</SelectItem>
                    <SelectItem value="licenca_militar">Serviço Militar</SelectItem>
                    <SelectItem value="suspensao">Suspensão</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim *</Label>
                  <Input type="date" />
                </div>
              </div>
              
              {/* Campos para Licença Médica/Acidente */}
              <div className="border-t pt-4 mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">Dados do Atestado Médico (se aplicável)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CID (Código da Doença)</Label>
                    <Input placeholder="Ex: J11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº Atestado</Label>
                    <Input placeholder="Número do atestado" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do Médico</Label>
                    <Input placeholder="Nome completo" />
                  </div>
                  <div className="space-y-2">
                    <Label>CRM</Label>
                    <Input placeholder="Ex: 12345-SP" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data do Atestado</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Observações adicionais..." />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 gradient-gold text-primary-foreground">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Em Andamento"
          value={emAndamento.toString()}
          icon={Clock}
          description="Afastamentos ativos"
          trend="neutral"
        />
        <StatCard
          title="Agendados"
          value={agendados.toString()}
          icon={Calendar}
          description="Próximos afastamentos"
          trend="up"
          trendValue="+2 este mês"
        />
        <StatCard
          title="Férias Acumuladas"
          value={`${feriasAcumuladas} dias`}
          icon={Plane}
          description="Total de dias pendentes"
          trend="neutral"
        />
        <StatCard
          title="Licenças no Mês"
          value={licencasMes.toString()}
          icon={HeartPulse}
          description="Licenças médicas"
          trend="down"
          trendValue="-1 vs mês anterior"
        />
      </div>

      {/* Alertas */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">Atenção: Férias vencendo</p>
            <p className="text-sm text-yellow-700">
              3 funcionários possuem férias vencidas ou próximas de vencer. Regularize a situação.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto border-yellow-600 text-yellow-600 hover:bg-yellow-100">
            Ver Lista
          </Button>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar funcionário..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="licenca_medica">Licença Médica</SelectItem>
                <SelectItem value="licenca_maternidade">Licença Maternidade</SelectItem>
                <SelectItem value="licenca_paternidade">Licença Paternidade</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Afastamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Afastamentos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAfastamentos.map((afastamento) => {
              const tipoInfo = tipoLabels[afastamento.tipo];
              const statusInfo = statusLabels[afastamento.status];
              const TipoIcon = tipoInfo.icon;

              return (
                <div
                  key={afastamento.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tipoInfo.color}`}>
                      <TipoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{afastamento.funcionario}</p>
                      <p className="text-sm text-muted-foreground">
                        {tipoInfo.label} • {afastamento.diasTotais} dias
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p>{new Date(afastamento.dataInicio).toLocaleDateString("pt-BR")}</p>
                      <p className="text-muted-foreground">
                        até {new Date(afastamento.dataFim).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
