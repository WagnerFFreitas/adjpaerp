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
  Check,
  Calendar,
  AlertCircle,
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

const contasPagar = [
  {
    id: 1,
    descricao: "Aluguel do Imóvel",
    fornecedor: "Imobiliária Central",
    categoria: "Aluguel",
    valor: 5000.00,
    dataVencimento: "01/02/2026",
    dataPagamento: null,
    tipoPagamento: "Boleto",
    status: "pendente",
    parcela: "1/12",
  },
  {
    id: 2,
    descricao: "Conta de Energia",
    fornecedor: "CPFL Energia",
    categoria: "Utilidades",
    valor: 850.00,
    dataVencimento: "28/01/2026",
    dataPagamento: null,
    tipoPagamento: "Débito Automático",
    status: "vencendo",
    parcela: null,
  },
  {
    id: 3,
    descricao: "Internet Fibra",
    fornecedor: "Vivo Empresas",
    categoria: "Utilidades",
    valor: 350.00,
    dataVencimento: "30/01/2026",
    dataPagamento: null,
    tipoPagamento: "Boleto",
    status: "pendente",
    parcela: null,
  },
  {
    id: 4,
    descricao: "Material de Escritório",
    fornecedor: "Kalunga",
    categoria: "Material",
    valor: 420.00,
    dataVencimento: "25/01/2026",
    dataPagamento: "25/01/2026",
    tipoPagamento: "Cartão",
    status: "pago",
    parcela: null,
  },
  {
    id: 5,
    descricao: "Serviço de Limpeza",
    fornecedor: "Clean Service",
    categoria: "Serviços",
    valor: 1500.00,
    dataVencimento: "20/01/2026",
    dataPagamento: null,
    tipoPagamento: "Transferência",
    status: "vencido",
    parcela: null,
  },
  {
    id: 6,
    descricao: "Manutenção Ar-Condicionado",
    fornecedor: "RefriTec",
    categoria: "Manutenção",
    valor: 800.00,
    dataVencimento: "15/02/2026",
    dataPagamento: null,
    tipoPagamento: "PIX",
    status: "pendente",
    parcela: null,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  vencendo: { label: "Vence Hoje", className: "bg-warning/10 text-warning border-warning/20" },
  vencido: { label: "Vencido", className: "bg-destructive/10 text-destructive border-destructive/20" },
  pago: { label: "Pago", className: "bg-success/10 text-success border-success/20" },
};

export default function ContasPagar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredContas = contasPagar.filter((c) => {
    const matchesSearch = c.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContas.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContas.map((c) => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedIds.length === filteredContas.length && filteredContas.length > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredContas.length;

  const totalSelecionado = filteredContas
    .filter((c) => selectedIds.includes(c.id))
    .reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Contas a Pagar</h1>
          <p className="page-subtitle">
            Gerencie todas as contas e despesas
          </p>
        </div>
        <Button variant="gradient" onClick={() => navigate("/financeiro/contas-pagar/nova")}>
          <Plus className="w-4 h-4" />
          Nova Conta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Total Pendente</p>
          <p className="text-xl font-bold text-foreground">
            R$ {contasPagar.filter(c => c.status !== 'pago').reduce((a, c) => a + c.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Vencidas</p>
          <p className="text-xl font-bold text-destructive">
            R$ {contasPagar.filter(c => c.status === 'vencido').reduce((a, c) => a + c.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Vence Hoje</p>
          <p className="text-xl font-bold text-warning">
            R$ {contasPagar.filter(c => c.status === 'vencendo').reduce((a, c) => a + c.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Pagas no Mês</p>
          <p className="text-xl font-bold text-success">
            R$ {contasPagar.filter(c => c.status === 'pago').reduce((a, c) => a + c.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição ou fornecedor..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="vencendo">Vence Hoje</SelectItem>
              <SelectItem value="vencido">Vencidas</SelectItem>
              <SelectItem value="pago">Pagas</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todas">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas Categorias</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
              <SelectItem value="utilidades">Utilidades</SelectItem>
              <SelectItem value="servicos">Serviços</SelectItem>
              <SelectItem value="material">Material</SelectItem>
              <SelectItem value="manutencao">Manutenção</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Mais Filtros
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
          <div>
            <span className="text-sm font-medium">
              {selectedIds.length} conta(s) selecionada(s)
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              • Total: R$ {totalSelecionado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              <Check className="w-4 h-4 mr-1" />
              Baixar Selecionadas
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Limpar
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
              <TableHead>Descrição</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Tipo Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContas.map((conta) => (
              <TableRow 
                key={conta.id} 
                className={`table-row-hover ${selectedIds.includes(conta.id) ? 'bg-primary/5' : ''}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(conta.id)}
                    onCheckedChange={() => toggleSelect(conta.id)}
                    aria-label={`Selecionar ${conta.descricao}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conta.status === 'vencido' ? 'bg-destructive/10' : 
                      conta.status === 'vencendo' ? 'bg-warning/10' : 'bg-muted'
                    }`}>
                      {conta.status === 'vencido' ? (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{conta.descricao}</p>
                      {conta.parcela && (
                        <p className="text-xs text-muted-foreground">Parcela {conta.parcela}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{conta.fornecedor}</TableCell>
                <TableCell>
                  <Badge variant="outline">{conta.categoria}</Badge>
                </TableCell>
                <TableCell>{conta.dataVencimento}</TableCell>
                <TableCell>{conta.tipoPagamento}</TableCell>
                <TableCell className="font-semibold">
                  R$ {conta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[conta.status].className}>
                    {statusConfig[conta.status].label}
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
                      {conta.status !== 'pago' && (
                        <DropdownMenuItem>
                          <Check className="w-4 h-4 mr-2" />
                          Baixar Conta
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
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
          Mostrando {filteredContas.length} de {contasPagar.length} contas
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
    </div>
  );
}
