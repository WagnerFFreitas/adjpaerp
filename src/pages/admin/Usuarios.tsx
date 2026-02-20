import { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Shield,
  Key,
  Clock,
  MoreVertical,
  Edit,
  Lock,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ultimoAcesso: string;
  status: "ativo" | "inativo" | "bloqueado";
  createdAt: string;
}

const usuarios: Usuario[] = [
  {
    id: "1",
    nome: "Admin Master",
    email: "admin@gestaoplus.com",
    perfil: "Administrador",
    ultimoAcesso: "2024-01-15 14:32",
    status: "ativo",
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    nome: "Maria Silva",
    email: "maria.silva@igreja.com",
    perfil: "RH",
    ultimoAcesso: "2024-01-15 10:15",
    status: "ativo",
    createdAt: "2023-03-15",
  },
  {
    id: "3",
    nome: "Pr. Carlos Alberto",
    email: "pr.carlos@igreja.com",
    perfil: "Pastor",
    ultimoAcesso: "2024-01-14 18:45",
    status: "ativo",
    createdAt: "2023-02-10",
  },
  {
    id: "4",
    nome: "João Santos",
    email: "joao.santos@igreja.com",
    perfil: "Secretaria",
    ultimoAcesso: "2024-01-13 09:00",
    status: "ativo",
    createdAt: "2023-06-20",
  },
  {
    id: "5",
    nome: "Ana Oliveira",
    email: "ana.oliveira@igreja.com",
    perfil: "Tesoureiro",
    ultimoAcesso: "2024-01-10 16:20",
    status: "inativo",
    createdAt: "2023-04-05",
  },
  {
    id: "6",
    nome: "Pedro Costa",
    email: "pedro.costa@igreja.com",
    perfil: "Visitante",
    ultimoAcesso: "2023-12-20 11:30",
    status: "bloqueado",
    createdAt: "2023-08-10",
  },
];

const perfis = [
  {
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    usuarios: 2,
    color: "bg-purple-100 text-purple-800",
  },
  {
    nome: "RH",
    descricao: "Gestão de funcionários e folha",
    usuarios: 3,
    color: "bg-blue-100 text-blue-800",
  },
  {
    nome: "Pastor",
    descricao: "Gestão pastoral e membros",
    usuarios: 4,
    color: "bg-green-100 text-green-800",
  },
  {
    nome: "Tesoureiro",
    descricao: "Gestão financeira",
    usuarios: 2,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    nome: "Secretaria",
    descricao: "Cadastros e atendimento",
    usuarios: 5,
    color: "bg-pink-100 text-pink-800",
  },
  {
    nome: "Visitante",
    descricao: "Apenas visualização",
    usuarios: 8,
    color: "bg-gray-100 text-gray-800",
  },
];

const perfilColors: Record<string, string> = {
  Administrador: "bg-purple-100 text-purple-800",
  RH: "bg-blue-100 text-blue-800",
  Pastor: "bg-green-100 text-green-800",
  Tesoureiro: "bg-yellow-100 text-yellow-800",
  Secretaria: "bg-pink-100 text-pink-800",
  Visitante: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  ativo: "bg-green-100 text-green-800",
  inativo: "bg-yellow-100 text-yellow-800",
  bloqueado: "bg-red-100 text-red-800",
};

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsuarios = usuarios.filter((u) => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPerfil = filterPerfil === "todos" || u.perfil === filterPerfil;
    const matchStatus = filterStatus === "todos" || u.status === filterStatus;
    return matchSearch && matchPerfil && matchStatus;
  });

  const ativos = usuarios.filter((u) => u.status === "ativo").length;
  const bloqueados = usuarios.filter((u) => u.status === "bloqueado").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Usuários
          </h1>
          <p className="text-muted-foreground">
            Gestão de acessos e permissões do sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-primary-foreground">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input placeholder="Nome do usuário" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Perfil de Acesso</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {perfis.map((p) => (
                      <SelectItem key={p.nome} value={p.nome}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Senha Temporária</Label>
                <Input type="password" placeholder="Senha inicial" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="enviar-email" />
                <Label htmlFor="enviar-email" className="text-sm font-normal">
                  Enviar e-mail com credenciais de acesso
                </Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 gradient-gold text-primary-foreground">
                  Criar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={usuarios.length.toString()}
          icon={Users}
          description="Cadastrados no sistema"
          trend="up"
          trendValue="+3 este mês"
        />
        <StatCard
          title="Usuários Ativos"
          value={ativos.toString()}
          icon={CheckCircle}
          description="Com acesso liberado"
          trend="neutral"
        />
        <StatCard
          title="Perfis de Acesso"
          value={perfis.length.toString()}
          icon={Shield}
          description="Níveis de permissão"
          trend="neutral"
        />
        <StatCard
          title="Bloqueados"
          value={bloqueados.toString()}
          icon={Lock}
          description="Acesso negado"
          trend="down"
          trendValue="-1"
        />
      </div>

      {/* Perfis de Acesso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Perfis de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {perfis.map((perfil) => (
              <div
                key={perfil.nome}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <Badge className={perfil.color}>{perfil.nome}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {perfil.descricao}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{perfil.usuarios}</p>
                  <p className="text-xs text-muted-foreground">usuários</p>
                </div>
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
                placeholder="Buscar por nome ou e-mail..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPerfil} onValueChange={setFilterPerfil}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os perfis</SelectItem>
                {perfis.map((p) => (
                  <SelectItem key={p.nome} value={p.nome}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
                <SelectItem value="bloqueado">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {usuario.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={perfilColors[usuario.perfil] || "bg-gray-100"}>
                      {usuario.perfil}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {usuario.ultimoAcesso}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[usuario.status]}>
                      {usuario.status === "ativo" && "Ativo"}
                      {usuario.status === "inativo" && "Inativo"}
                      {usuario.status === "bloqueado" && "Bloqueado"}
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
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="w-4 h-4 mr-2" />
                          Resetar Senha
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {usuario.status === "bloqueado" ? (
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Desbloquear
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Lock className="w-4 h-4 mr-2" />
                            Bloquear
                          </DropdownMenuItem>
                        )}
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
