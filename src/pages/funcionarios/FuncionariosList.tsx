import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrachaModal } from "@/components/funcionarios/CrachaModal";
import "@/styles/cracha-print.css";

const funcionarios = [
  {
    id: 1,
    nome: "Maria Silva Santos",
    matricula: "001234",
    cargo: "Analista Financeiro",
    departamento: "Financeiro",
    tipoContrato: "CLT",
    dataAdmissao: "15/03/2022",
    status: "Ativo",
    salario: "R$ 5.500,00",
  },
  {
    id: 2,
    nome: "João Pedro Costa",
    matricula: "001235",
    cargo: "Desenvolvedor",
    departamento: "TI",
    tipoContrato: "CLT",
    dataAdmissao: "02/01/2021",
    status: "Ativo",
    salario: "R$ 8.200,00",
  },
  {
    id: 3,
    nome: "Ana Carolina Lima",
    matricula: "001236",
    cargo: "Secretária",
    departamento: "Administrativo",
    tipoContrato: "CLT",
    dataAdmissao: "10/06/2023",
    status: "Ativo",
    salario: "R$ 3.200,00",
  },
  {
    id: 4,
    nome: "Carlos Eduardo Souza",
    matricula: "001237",
    cargo: "Contador",
    departamento: "Financeiro",
    tipoContrato: "PJ",
    dataAdmissao: "05/08/2020",
    status: "Ativo",
    salario: "R$ 7.800,00",
  },
  {
    id: 5,
    nome: "Fernanda Oliveira",
    matricula: "001238",
    cargo: "Estagiária",
    departamento: "RH",
    tipoContrato: "Estágio",
    dataAdmissao: "01/02/2024",
    status: "Ativo",
    salario: "R$ 1.800,00",
  },
  {
    id: 6,
    nome: "Roberto Almeida",
    matricula: "001239",
    cargo: "Zelador",
    departamento: "Serviços Gerais",
    tipoContrato: "CLT",
    dataAdmissao: "20/11/2019",
    status: "Afastado",
    salario: "R$ 2.100,00",
  },
];

const statusColors: Record<string, string> = {
  Ativo: "bg-success/10 text-success border-success/20",
  Afastado: "bg-warning/10 text-warning border-warning/20",
  Desligado: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function FuncionariosList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [crachaModalOpen, setCrachaModalOpen] = useState(false);
  const [selectedForCracha, setSelectedForCracha] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredFuncionarios = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.matricula.includes(searchTerm) ||
      f.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCrachaModal = (ids?: number[]) => {
    setSelectedForCracha(ids || selectedIds);
    setCrachaModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFuncionarios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFuncionarios.map((f) => f.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedIds.length === filteredFuncionarios.length && filteredFuncionarios.length > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredFuncionarios.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="page-subtitle">
            Gerencie todos os colaboradores da organização
          </p>
        </div>
        <Button variant="gradient" onClick={() => navigate("/funcionarios/novo")}>
          <Plus className="w-4 h-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, matrícula ou cargo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="todos">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="afastado">Afastados</SelectItem>
              <SelectItem value="desligado">Desligados</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Departamentos</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="ti">TI</SelectItem>
              <SelectItem value="rh">RH</SelectItem>
              <SelectItem value="administrativo">Administrativo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Mais Filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleOpenCrachaModal()}
            disabled={selectedIds.length === 0}
          >
            <CreditCard className="w-4 h-4" />
            Crachás {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Selected Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="card-elevated p-3 bg-primary/5 border-primary/20 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} funcionário(s) selecionado(s)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleOpenCrachaModal()}>
              <CreditCard className="w-4 h-4 mr-1" />
              Imprimir Crachás
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Exportar Selecionados
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Limpar Seleção
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement).dataset.state = isSomeSelected ? "indeterminate" : isAllSelected ? "checked" : "unchecked";
                    }
                  }}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead>Funcionário</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Admissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFuncionarios.map((funcionario) => (
              <TableRow 
                key={funcionario.id} 
                className={`table-row-hover ${selectedIds.includes(funcionario.id) ? 'bg-primary/5' : ''}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(funcionario.id)}
                    onCheckedChange={() => toggleSelect(funcionario.id)}
                    aria-label={`Selecionar ${funcionario.nome}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{funcionario.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {funcionario.salario}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {funcionario.matricula}
                </TableCell>
                <TableCell>{funcionario.cargo}</TableCell>
                <TableCell>{funcionario.departamento}</TableCell>
                <TableCell>
                  <Badge variant="outline">{funcionario.tipoContrato}</Badge>
                </TableCell>
                <TableCell>{funcionario.dataAdmissao}</TableCell>
                <TableCell>
                  <Badge className={statusColors[funcionario.status]}>
                    {funcionario.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/funcionarios/${funcionario.id}`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/funcionarios/${funcionario.id}/editar`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenCrachaModal([funcionario.id])}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Imprimir Crachá
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredFuncionarios.length} de {funcionarios.length} funcionários
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Próximo
          </Button>
        </div>
      </div>

      {/* Modal de Crachás */}
      <CrachaModal
        open={crachaModalOpen}
        onOpenChange={setCrachaModalOpen}
        funcionarios={funcionarios}
        preSelectedIds={selectedForCracha}
      />
    </div>
  );
}
