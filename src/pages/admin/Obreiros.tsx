import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Star,
  Award,
  Calendar,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface Obreiro {
  id: string;
  nome: string;
  cargo: string;
  ministerio: string;
  dataConsagracao: string;
  telefone: string;
  email: string;
  status: "ativo" | "afastado" | "inativo";
}

const obreiros: Obreiro[] = [
  {
    id: "1",
    nome: "Pr. Carlos Alberto Silva",
    cargo: "Pastor Presidente",
    ministerio: "Presidência",
    dataConsagracao: "1995-03-15",
    telefone: "(11) 99999-0001",
    email: "pr.carlos@igreja.com",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Pr. Roberto Santos",
    cargo: "Pastor Auxiliar",
    ministerio: "Discipulado",
    dataConsagracao: "2005-07-20",
    telefone: "(11) 99999-0002",
    email: "pr.roberto@igreja.com",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Ev. Maria Oliveira",
    cargo: "Evangelista",
    ministerio: "Evangelismo",
    dataConsagracao: "2010-11-10",
    telefone: "(11) 99999-0003",
    email: "ev.maria@igreja.com",
    status: "ativo",
  },
  {
    id: "4",
    nome: "Dc. Paulo Ferreira",
    cargo: "Diácono",
    ministerio: "Ação Social",
    dataConsagracao: "2018-05-05",
    telefone: "(11) 99999-0004",
    email: "dc.paulo@igreja.com",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Dca. Ana Costa",
    cargo: "Diaconisa",
    ministerio: "Intercessão",
    dataConsagracao: "2019-08-15",
    telefone: "(11) 99999-0005",
    email: "dca.ana@igreja.com",
    status: "afastado",
  },
  {
    id: "6",
    nome: "Pb. Lucas Mendes",
    cargo: "Presbítero",
    ministerio: "Louvor",
    dataConsagracao: "2015-02-28",
    telefone: "(11) 99999-0006",
    email: "pb.lucas@igreja.com",
    status: "ativo",
  },
];

const cargoColors: Record<string, string> = {
  "Pastor Presidente": "bg-purple-100 text-purple-800",
  "Pastor Auxiliar": "bg-blue-100 text-blue-800",
  "Evangelista": "bg-green-100 text-green-800",
  "Diácono": "bg-yellow-100 text-yellow-800",
  "Diaconisa": "bg-pink-100 text-pink-800",
  "Presbítero": "bg-orange-100 text-orange-800",
};

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800",
  afastado: "bg-yellow-100 text-yellow-800",
  inativo: "bg-red-100 text-red-800",
};

export default function Obreiros() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("todos");

  const filteredObreiros = obreiros.filter((o) => {
    const matchSearch = o.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCargo = filterCargo === "todos" || o.cargo === filterCargo;
    return matchSearch && matchCargo;
  });

  const ativos = obreiros.filter((o) => o.status === "ativo").length;
  const pastores = obreiros.filter((o) => o.cargo.includes("Pastor")).length;
  const diaconato = obreiros.filter((o) => 
    o.cargo.includes("Diácono") || o.cargo.includes("Diaconisa")
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Obreiros e Pastores
          </h1>
          <p className="text-muted-foreground">
            Gestão do corpo ministerial
          </p>
        </div>
        <Button className="gradient-gold text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Novo Obreiro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total de Obreiros"
          value={obreiros.length.toString()}
          icon={Users}
          description="Cadastrados no sistema"
          trend="neutral"
        />
        <StatCard
          title="Ativos"
          value={ativos.toString()}
          icon={Star}
          description="Em plena atividade"
          trend="up"
          trendValue="+2"
        />
        <StatCard
          title="Pastores"
          value={pastores.toString()}
          icon={Award}
          description="Corpo pastoral"
          trend="neutral"
        />
        <StatCard
          title="Diaconato"
          value={diaconato.toString()}
          icon={Users}
          description="Diáconos e diaconisas"
          trend="up"
          trendValue="+1"
        />
      </div>

      {/* Hierarquia */}
      <Card>
        <CardHeader>
          <CardTitle>Estrutura Ministerial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[
              { cargo: "Pastor Presidente", qtd: 1 },
              { cargo: "Pastor Auxiliar", qtd: 1 },
              { cargo: "Evangelista", qtd: 2 },
              { cargo: "Presbítero", qtd: 3 },
              { cargo: "Diácono", qtd: 5 },
              { cargo: "Diaconisa", qtd: 4 },
            ].map((item) => (
              <div
                key={item.cargo}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg"
              >
                <Badge className={cargoColors[item.cargo] || "bg-gray-100"}>
                  {item.cargo}
                </Badge>
                <span className="font-medium">{item.qtd}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar obreiro..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCargo} onValueChange={setFilterCargo}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cargos</SelectItem>
                <SelectItem value="Pastor Presidente">Pastor Presidente</SelectItem>
                <SelectItem value="Pastor Auxiliar">Pastor Auxiliar</SelectItem>
                <SelectItem value="Evangelista">Evangelista</SelectItem>
                <SelectItem value="Presbítero">Presbítero</SelectItem>
                <SelectItem value="Diácono">Diácono</SelectItem>
                <SelectItem value="Diaconisa">Diaconisa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Obreiros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Obreiros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obreiro</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Ministério</TableHead>
                <TableHead>Consagração</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObreiros.map((obreiro) => (
                <TableRow key={obreiro.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {obreiro.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{obreiro.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cargoColors[obreiro.cargo] || "bg-gray-100"}>
                      {obreiro.cargo}
                    </Badge>
                  </TableCell>
                  <TableCell>{obreiro.ministerio}</TableCell>
                  <TableCell>
                    {new Date(obreiro.dataConsagracao).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{obreiro.telefone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[obreiro.status]}>
                      {obreiro.status === "ativo" && "Ativo"}
                      {obreiro.status === "afastado" && "Afastado"}
                      {obreiro.status === "inativo" && "Inativo"}
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
                        <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>
    </div>
  );
}
