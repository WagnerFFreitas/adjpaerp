import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Heart,
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
import { CarteirinhaModal } from "@/components/membros/CarteirinhaModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import "@/styles/cracha-print.css";

interface Membro {
  id: string;
  nome: string;
  telefone: string;
  ministerio: string;
  cargo: string;
  dataBatismo: string | null;
  status: string;
  dizimista: boolean;
  posicaoEclesiastica?: string;
  membroDesde?: string;
  tipoSanguineo?: string;
  contatoEmergencia?: string;
  foto?: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  PENDING: "bg-info/10 text-info border-info/20",
  INACTIVE: "bg-warning/10 text-warning border-warning/20",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  PENDING: "Congregado",
  INACTIVE: "Afastado",
};

export default function MembrosList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [carteirinhaModalOpen, setCarteirinhaModalOpen] = useState(false);
  const [selectedForCarteirinha, setSelectedForCarteirinha] = useState<string[]>([]);

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name");

      if (error) throw error;

      const mappedMembros: Membro[] = (data || []).map((m) => ({
        id: m.id,
        nome: m.name,
        telefone: m.phone || "",
        ministerio: m.main_ministry || "Não definido",
        cargo: m.ministry_role || "Membro",
        dataBatismo: m.baptism_date ? new Date(m.baptism_date).toLocaleDateString("pt-BR") : null,
        status: m.status || "ACTIVE",
        dizimista: m.is_tithable || false,
        posicaoEclesiastica: m.ecclesiastical_position,
        membroDesde: m.membership_date ? new Date(m.membership_date).toLocaleDateString("pt-BR") : undefined,
        tipoSanguineo: m.blood_type,
        contatoEmergencia: m.emergency_contact_phone,
        foto: m.avatar_url,
      }));

      setMembros(mappedMembros);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      toast.error("Erro ao carregar membros");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembros = membros.filter(
    (m) =>
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.ministerio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMembros.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembros.map((m) => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCarteirinhaModal = (ids?: string[]) => {
    setSelectedForCarteirinha(ids || selectedIds);
    setCarteirinhaModalOpen(true);
  };

  const isAllSelected = selectedIds.length === filteredMembros.length && filteredMembros.length > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < filteredMembros.length;

  // Preparar membros para o modal de carteirinha
  const membrosParaCarteirinha = membros.map((m) => ({
    id: m.id,
    nome: m.nome,
    ministerio: m.ministerio,
    cargo: m.cargo,
    dataBatismo: m.dataBatismo || undefined,
    membroDesde: m.membroDesde,
    posicaoEclesiastica: m.posicaoEclesiastica,
    foto: m.foto,
    telefone: m.telefone,
    tipoSanguineo: m.tipoSanguineo,
    contatoEmergencia: m.contatoEmergencia,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Membros da Igreja</h1>
          <p className="page-subtitle">
            Gerencie todos os membros da congregação
          </p>
        </div>
        <Button variant="gold" onClick={() => navigate("/igreja/membros/novo")}>
          <Plus className="w-4 h-4" />
          Novo Membro
        </Button>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou ministério..."
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
              <SelectItem value="ACTIVE">Ativos</SelectItem>
              <SelectItem value="PENDING">Congregados</SelectItem>
              <SelectItem value="INACTIVE">Afastados</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todos">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Ministério" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Ministérios</SelectItem>
              <SelectItem value="louvor">Louvor</SelectItem>
              <SelectItem value="infantil">Infantil</SelectItem>
              <SelectItem value="jovens">Jovens</SelectItem>
              <SelectItem value="intercessao">Intercessão</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => handleOpenCarteirinhaModal()}
            disabled={selectedIds.length === 0}
          >
            <CreditCard className="w-4 h-4" />
            Carteirinhas {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Selected Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="card-elevated p-3 bg-secondary/5 border-secondary/20 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} membro(s) selecionado(s)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleOpenCarteirinhaModal()}>
              <CreditCard className="w-4 h-4 mr-1" />
              Imprimir Carteirinhas
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
              <TableHead>Membro</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Ministério</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Batismo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dizimista</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembros.map((membro) => (
              <TableRow 
                key={membro.id} 
                className={`table-row-hover ${selectedIds.includes(membro.id) ? 'bg-secondary/5' : ''}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(membro.id)}
                    onCheckedChange={() => toggleSelect(membro.id)}
                    aria-label={`Selecionar ${membro.nome}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <span className="font-medium">{membro.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{membro.telefone}</TableCell>
                <TableCell>{membro.ministerio}</TableCell>
                <TableCell>{membro.cargo}</TableCell>
                <TableCell>
                  {membro.dataBatismo || (
                    <span className="text-muted-foreground">Não batizado</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[membro.status] || statusColors.ACTIVE}>
                    {statusLabels[membro.status] || membro.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {membro.dizimista ? (
                    <Heart className="w-5 h-5 text-success fill-success" />
                  ) : (
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenCarteirinhaModal([membro.id])}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Imprimir Carteirinha
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
          Mostrando {filteredMembros.length} de {membros.length} membros
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

      {/* Modal de Carteirinhas */}
      <CarteirinhaModal
        open={carteirinhaModalOpen}
        onOpenChange={setCarteirinhaModalOpen}
        membros={membrosParaCarteirinha}
        preSelectedIds={selectedForCarteirinha}
      />
    </div>
  );
}
