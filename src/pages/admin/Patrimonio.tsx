import { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Building2,
  Car,
  Laptop,
  Music,
  Sofa,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  QrCode,
  FileText,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Patrimonio {
  id: string;
  codigo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  dataAquisicao: string;
  valorAquisicao: number;
  valorAtual: number;
  status: "bom" | "regular" | "manutencao" | "baixado";
}

const patrimonios: Patrimonio[] = [
  {
    id: "1",
    codigo: "PAT-001",
    descricao: "Sistema de Som Completo",
    categoria: "Equipamento de Som",
    localizacao: "Templo Principal",
    dataAquisicao: "2022-03-15",
    valorAquisicao: 45000,
    valorAtual: 38000,
    status: "bom",
  },
  {
    id: "2",
    codigo: "PAT-002",
    descricao: "Projetor Epson 4K",
    categoria: "Equipamento Audiovisual",
    localizacao: "Templo Principal",
    dataAquisicao: "2023-01-10",
    valorAquisicao: 8500,
    valorAtual: 7500,
    status: "bom",
  },
  {
    id: "3",
    codigo: "PAT-003",
    descricao: "Van Mercedes Sprinter",
    categoria: "Veículo",
    localizacao: "Estacionamento",
    dataAquisicao: "2021-06-20",
    valorAquisicao: 180000,
    valorAtual: 145000,
    status: "regular",
  },
  {
    id: "4",
    codigo: "PAT-004",
    descricao: "Notebook Dell Inspiron",
    categoria: "Informática",
    localizacao: "Secretaria",
    dataAquisicao: "2023-08-05",
    valorAquisicao: 4200,
    valorAtual: 3800,
    status: "bom",
  },
  {
    id: "5",
    codigo: "PAT-005",
    descricao: "Ar Condicionado Split 36000 BTU",
    categoria: "Climatização",
    localizacao: "Templo Principal",
    dataAquisicao: "2022-11-30",
    valorAquisicao: 6500,
    valorAtual: 5000,
    status: "manutencao",
  },
  {
    id: "6",
    codigo: "PAT-006",
    descricao: "Cadeiras Estofadas (100 unid)",
    categoria: "Mobiliário",
    localizacao: "Templo Principal",
    dataAquisicao: "2020-05-10",
    valorAquisicao: 35000,
    valorAtual: 20000,
    status: "regular",
  },
];

const categoriaIcons: Record<string, React.ElementType> = {
  "Equipamento de Som": Music,
  "Equipamento Audiovisual": Laptop,
  "Veículo": Car,
  "Informática": Laptop,
  "Climatização": Building2,
  "Mobiliário": Sofa,
};

const statusColors: Record<string, string> = {
  bom: "bg-green-100 text-green-800",
  regular: "bg-yellow-100 text-yellow-800",
  manutencao: "bg-orange-100 text-orange-800",
  baixado: "bg-red-100 text-red-800",
};

export default function Patrimonio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filteredPatrimonios = patrimonios.filter((p) => {
    const matchSearch = p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filterCategoria === "todos" || p.categoria === filterCategoria;
    const matchStatus = filterStatus === "todos" || p.status === filterStatus;
    return matchSearch && matchCategoria && matchStatus;
  });

  const totalPatrimonio = patrimonios.reduce((acc, p) => acc + p.valorAtual, 0);
  const emManutencao = patrimonios.filter((p) => p.status === "manutencao").length;
  const categorias = [...new Set(patrimonios.map((p) => p.categoria))].length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Patrimônio
          </h1>
          <p className="text-muted-foreground">
            Controle de bens e equipamentos da igreja
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            Gerar Etiquetas
          </Button>
          <Button className="gradient-gold text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Valor Total"
          value={`R$ ${(totalPatrimonio / 1000).toFixed(0)}k`}
          icon={Package}
          description="Patrimônio avaliado"
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          title="Total de Itens"
          value={patrimonios.length.toString()}
          icon={Package}
          description="Bens cadastrados"
          trend="neutral"
        />
        <StatCard
          title="Em Manutenção"
          value={emManutencao.toString()}
          icon={AlertTriangle}
          description="Itens em reparo"
          trend="down"
          trendValue="-1"
        />
        <StatCard
          title="Categorias"
          value={categorias.toString()}
          icon={Building2}
          description="Tipos de patrimônio"
          trend="neutral"
        />
      </div>

      {/* Alertas */}
      {emManutencao > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Itens em Manutenção</p>
              <p className="text-sm text-orange-700">
                {emManutencao} item(s) aguardando reparo ou manutenção
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto border-orange-600 text-orange-600 hover:bg-orange-100">
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou código..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                <SelectItem value="Equipamento de Som">Equipamento de Som</SelectItem>
                <SelectItem value="Equipamento Audiovisual">Audiovisual</SelectItem>
                <SelectItem value="Veículo">Veículos</SelectItem>
                <SelectItem value="Informática">Informática</SelectItem>
                <SelectItem value="Climatização">Climatização</SelectItem>
                <SelectItem value="Mobiliário">Mobiliário</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="bom">Bom Estado</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="manutencao">Em Manutenção</SelectItem>
                <SelectItem value="baixado">Baixado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Patrimônio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventário</CardTitle>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead className="text-right">Valor Atual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatrimonios.map((item) => {
                const CategoriaIcon = categoriaIcons[item.categoria] || Package;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <CategoriaIcon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.descricao}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell>{item.localizacao}</TableCell>
                    <TableCell className="text-right">
                      R$ {item.valorAtual.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status]}>
                        {item.status === "bom" && "Bom Estado"}
                        {item.status === "regular" && "Regular"}
                        {item.status === "manutencao" && "Em Manutenção"}
                        {item.status === "baixado" && "Baixado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
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
                          <DropdownMenuItem>
                            <QrCode className="w-4 h-4 mr-2" />
                            Gerar QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Baixar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
