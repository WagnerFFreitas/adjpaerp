import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Minus,
  Clock,
  DollarSign,
  Calculator,
  Lock,
  Unlock,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const caixaAtual = {
  status: "aberto",
  dataAbertura: "28/01/2026 08:00",
  operador: "Maria Silva",
  saldoAbertura: 500.00,
  saldoAtual: 3250.00,
  totalEntradas: 3500.00,
  totalSaidas: 750.00,
};

const movimentacoesCaixa = [
  {
    id: 1,
    hora: "08:00",
    tipo: "abertura",
    descricao: "Abertura de Caixa",
    formaPagamento: "-",
    valor: 500.00,
    saldoApos: 500.00,
  },
  {
    id: 2,
    hora: "09:15",
    tipo: "entrada",
    descricao: "Dízimo - João Silva",
    formaPagamento: "Dinheiro",
    valor: 500.00,
    saldoApos: 1000.00,
  },
  {
    id: 3,
    hora: "09:30",
    tipo: "entrada",
    descricao: "Oferta Culto Manhã",
    formaPagamento: "Dinheiro",
    valor: 1200.00,
    saldoApos: 2200.00,
  },
  {
    id: 4,
    hora: "10:00",
    tipo: "saida",
    descricao: "Sangria - Depósito Banco",
    formaPagamento: "-",
    valor: 500.00,
    saldoApos: 1700.00,
  },
  {
    id: 5,
    hora: "11:00",
    tipo: "entrada",
    descricao: "Dízimo - Maria Santos",
    formaPagamento: "PIX",
    valor: 800.00,
    saldoApos: 2500.00,
  },
  {
    id: 6,
    hora: "11:30",
    tipo: "entrada",
    descricao: "Oferta Especial",
    formaPagamento: "Cartão Débito",
    valor: 1000.00,
    saldoApos: 3500.00,
  },
  {
    id: 7,
    hora: "12:00",
    tipo: "saida",
    descricao: "Pagamento Fornecedor",
    formaPagamento: "Dinheiro",
    valor: 250.00,
    saldoApos: 3250.00,
  },
];

const tipoConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  abertura: { label: "Abertura", className: "bg-primary/10 text-primary", icon: Unlock },
  entrada: { label: "Entrada", className: "bg-success/10 text-success", icon: ArrowUpRight },
  saida: { label: "Saída", className: "bg-destructive/10 text-destructive", icon: ArrowDownRight },
  fechamento: { label: "Fechamento", className: "bg-muted text-muted-foreground", icon: Lock },
};

export default function Caixa() {
  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);
  const [modalFechamento, setModalFechamento] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Controle de Caixa</h1>
          <p className="page-subtitle">
            Gerencie as movimentações do caixa diário
          </p>
        </div>
        <div className="flex gap-2">
          {caixaAtual.status === "aberto" ? (
            <>
              <Button variant="outline" onClick={() => setModalSaida(true)}>
                <Minus className="w-4 h-4" />
                Sangria
              </Button>
              <Button variant="gradient" onClick={() => setModalEntrada(true)}>
                <Plus className="w-4 h-4" />
                Entrada
              </Button>
              <Button variant="destructive" onClick={() => setModalFechamento(true)}>
                <Lock className="w-4 h-4" />
                Fechar Caixa
              </Button>
            </>
          ) : (
            <Button variant="gradient">
              <Unlock className="w-4 h-4" />
              Abrir Caixa
            </Button>
          )}
        </div>
      </div>

      {/* Status do Caixa */}
      <Card className="card-elevated border-l-4 border-l-success">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Caixa Aberto</h3>
                  <Badge className="bg-success/10 text-success">Operando</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aberto em {caixaAtual.dataAbertura} por {caixaAtual.operador}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
              <p className="text-3xl font-bold text-success">
                R$ {caixaAtual.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Abertura
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {caixaAtual.saldoAbertura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entradas
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {caixaAtual.totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Saídas
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {caixaAtual.totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Diferença
            </CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {(caixaAtual.totalEntradas - caixaAtual.totalSaidas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimentações */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Movimentações do Dia</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20">Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Forma Pgto</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Saldo Após</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoesCaixa.map((mov) => {
                const config = tipoConfig[mov.tipo];
                const Icone = config.icon;
                return (
                  <TableRow key={mov.id} className="table-row-hover">
                    <TableCell className="font-mono text-sm">{mov.hora}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.className}`}>
                          <Icone className="w-4 h-4" />
                        </div>
                        <Badge className={config.className}>{config.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{mov.descricao}</TableCell>
                    <TableCell>{mov.formaPagamento}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      mov.tipo === 'entrada' ? 'text-success' : 
                      mov.tipo === 'saida' ? 'text-destructive' : ''
                    }`}>
                      {mov.tipo === 'entrada' ? '+' : mov.tipo === 'saida' ? '-' : ''}
                      R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {mov.saldoApos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {mov.tipo !== 'abertura' && mov.tipo !== 'fechamento' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Estornar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Entrada */}
      <Dialog open={modalEntrada} onOpenChange={setModalEntrada}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Entrada</DialogTitle>
            <DialogDescription>
              Registre uma entrada no caixa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Ex: Dízimo - Nome do Membro" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dizimo">Dízimo</SelectItem>
                  <SelectItem value="oferta">Oferta</SelectItem>
                  <SelectItem value="campanha">Campanha</SelectItem>
                  <SelectItem value="doacao">Doação</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma">Forma de Pagamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao-debito">Cartão Débito</SelectItem>
                  <SelectItem value="cartao-credito">Cartão Crédito</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input id="valor" type="number" step="0.01" className="pl-10" placeholder="0,00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obs">Observações</Label>
              <Textarea id="obs" placeholder="Observações adicionais (opcional)" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEntrada(false)}>
              Cancelar
            </Button>
            <Button variant="gradient" onClick={() => setModalEntrada(false)}>
              <Plus className="w-4 h-4" />
              Registrar Entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Saída/Sangria */}
      <Dialog open={modalSaida} onOpenChange={setModalSaida}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Sangria</DialogTitle>
            <DialogDescription>
              Registre uma saída/sangria do caixa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposito">Depósito Bancário</SelectItem>
                  <SelectItem value="pagamento">Pagamento Fornecedor</SelectItem>
                  <SelectItem value="despesa">Despesa Imediata</SelectItem>
                  <SelectItem value="troco">Troco/Suprimento</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoSaida">Descrição</Label>
              <Input id="descricaoSaida" placeholder="Detalhes da sangria" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorSaida">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input id="valorSaida" type="number" step="0.01" className="pl-10" placeholder="0,00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obsSaida">Observações</Label>
              <Textarea id="obsSaida" placeholder="Observações adicionais (opcional)" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalSaida(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => setModalSaida(false)}>
              <Minus className="w-4 h-4" />
              Registrar Sangria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Fechamento */}
      <Dialog open={modalFechamento} onOpenChange={setModalFechamento}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Fechamento de Caixa</DialogTitle>
            <DialogDescription>
              Confira os valores e feche o caixa do dia
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo Sistema</p>
                <p className="text-2xl font-bold">R$ {caixaAtual.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Saldo Informado</p>
                <Input type="number" step="0.01" placeholder="0,00" className="mt-1 text-xl font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contagem de Dinheiro</Label>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 100</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 50</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 20</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 10</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 5</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 2</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">R$ 1</p>
                  <Input type="number" className="h-8 mt-1" placeholder="0" />
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">Moedas</p>
                  <Input type="number" step="0.01" className="h-8 mt-1" placeholder="0,00" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obsFechamento">Observações do Fechamento</Label>
              <Textarea id="obsFechamento" placeholder="Observações sobre o fechamento" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalFechamento(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => setModalFechamento(false)}>
              <Lock className="w-4 h-4" />
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
