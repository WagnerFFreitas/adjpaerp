import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  Wallet,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const icones: Record<string, React.ElementType> = {
  dinheiro: Banknote,
  cartao: CreditCard,
  pix: Smartphone,
  transferencia: Building,
  boleto: Wallet,
};

const tiposPagamento = [
  {
    id: 1,
    nome: "Dinheiro",
    icone: "dinheiro",
    descricao: "Pagamento em espécie",
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoRecebimento: 0,
    ativo: true,
    padrao: true,
  },
  {
    id: 2,
    nome: "PIX",
    icone: "pix",
    descricao: "Transferência instantânea",
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoRecebimento: 0,
    ativo: true,
    padrao: false,
  },
  {
    id: 3,
    nome: "Cartão de Crédito",
    icone: "cartao",
    descricao: "Pagamento via cartão de crédito",
    taxaPercentual: 2.99,
    taxaFixa: 0,
    prazoRecebimento: 30,
    ativo: true,
    padrao: false,
  },
  {
    id: 4,
    nome: "Cartão de Débito",
    icone: "cartao",
    descricao: "Pagamento via cartão de débito",
    taxaPercentual: 1.49,
    taxaFixa: 0,
    prazoRecebimento: 1,
    ativo: true,
    padrao: false,
  },
  {
    id: 5,
    nome: "Transferência Bancária",
    icone: "transferencia",
    descricao: "TED ou DOC",
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoRecebimento: 1,
    ativo: true,
    padrao: false,
  },
  {
    id: 6,
    nome: "Boleto Bancário",
    icone: "boleto",
    descricao: "Pagamento via boleto",
    taxaPercentual: 0,
    taxaFixa: 3.50,
    prazoRecebimento: 3,
    ativo: true,
    padrao: false,
  },
  {
    id: 7,
    nome: "Cheque",
    icone: "dinheiro",
    descricao: "Pagamento via cheque",
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoRecebimento: 7,
    ativo: false,
    padrao: false,
  },
];

export default function TiposPagamento() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTipos = tiposPagamento.filter((t) =>
    t.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTipos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTipos.map((t) => t.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedIds.length === filteredTipos.length && filteredTipos.length > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredTipos.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Tipos de Pagamento</h1>
          <p className="page-subtitle">
            Configure as formas de pagamento aceitas
          </p>
        </div>
        <Button variant="gradient" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Tipo
        </Button>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tipo de pagamento..."
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
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="card-elevated p-3 bg-primary/5 border-primary/20 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} tipo(s) selecionado(s)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Check className="w-4 h-4 mr-1" />
              Ativar
            </Button>
            <Button size="sm" variant="outline" className="text-destructive">
              Desativar
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
              <TableHead>Tipo de Pagamento</TableHead>
              <TableHead>Taxa (%)</TableHead>
              <TableHead>Taxa Fixa</TableHead>
              <TableHead>Prazo Recebimento</TableHead>
              <TableHead>Padrão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTipos.map((tipo) => {
              const Icone = icones[tipo.icone] || Wallet;
              return (
                <TableRow 
                  key={tipo.id} 
                  className={`table-row-hover ${selectedIds.includes(tipo.id) ? 'bg-primary/5' : ''}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(tipo.id)}
                      onCheckedChange={() => toggleSelect(tipo.id)}
                      aria-label={`Selecionar ${tipo.nome}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{tipo.nome}</p>
                        <p className="text-xs text-muted-foreground">{tipo.descricao}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tipo.taxaPercentual > 0 ? `${tipo.taxaPercentual}%` : '-'}
                  </TableCell>
                  <TableCell>
                    {tipo.taxaFixa > 0 ? `R$ ${tipo.taxaFixa.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    {tipo.prazoRecebimento === 0 ? 'Imediato' : `${tipo.prazoRecebimento} dia(s)`}
                  </TableCell>
                  <TableCell>
                    {tipo.padrao && (
                      <Badge className="bg-primary/10 text-primary">Padrão</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch checked={tipo.ativo} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setModalOpen(true)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {!tipo.padrao && (
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal Novo/Editar Tipo */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Tipo de Pagamento</DialogTitle>
            <DialogDescription>
              Configure os detalhes da forma de pagamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Ex: Cartão de Crédito" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Breve descrição" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icone">Ícone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ícone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">💵 Dinheiro</SelectItem>
                  <SelectItem value="cartao">💳 Cartão</SelectItem>
                  <SelectItem value="pix">📱 PIX</SelectItem>
                  <SelectItem value="transferencia">🏦 Transferência</SelectItem>
                  <SelectItem value="boleto">📄 Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxaPercent">Taxa (%)</Label>
                <Input id="taxaPercent" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxaFixa">Taxa Fixa (R$)</Label>
                <Input id="taxaFixa" type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prazo">Prazo de Recebimento (dias)</Label>
              <Input id="prazo" type="number" placeholder="0" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ativo">Ativo</Label>
              <Switch id="ativo" defaultChecked />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="gradient" onClick={() => setModalOpen(false)}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
