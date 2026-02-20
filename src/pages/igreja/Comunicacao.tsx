import { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Send,
  Users,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  destinatarios: string;
  tipo: "email" | "sms" | "push";
  status: "enviado" | "agendado" | "rascunho";
  alcance: number;
}

const comunicados: Comunicado[] = [
  {
    id: "1",
    titulo: "Culto Especial de Ano Novo",
    conteudo: "Venha participar do nosso culto especial de virada de ano...",
    data: "2024-01-01",
    destinatarios: "Todos os membros",
    tipo: "email",
    status: "enviado",
    alcance: 450,
  },
  {
    id: "2",
    titulo: "Reunião de Líderes",
    conteudo: "Convocação para reunião extraordinária de líderes...",
    data: "2024-01-10",
    destinatarios: "Líderes",
    tipo: "push",
    status: "enviado",
    alcance: 45,
  },
  {
    id: "3",
    titulo: "Campanha de Oração",
    conteudo: "Participe da nossa campanha de 21 dias de oração...",
    data: "2024-02-01",
    destinatarios: "Todos os membros",
    tipo: "email",
    status: "agendado",
    alcance: 500,
  },
  {
    id: "4",
    titulo: "Aniversariantes do Mês",
    conteudo: "Parabéns aos aniversariantes de janeiro...",
    data: "2024-01-15",
    destinatarios: "Aniversariantes",
    tipo: "sms",
    status: "rascunho",
    alcance: 32,
  },
];

const tipoIcons: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

const statusColors: Record<string, string> = {
  enviado: "bg-green-100 text-green-800",
  agendado: "bg-blue-100 text-blue-800",
  rascunho: "bg-gray-100 text-gray-800",
};

export default function Comunicacao() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredComunicados = comunicados.filter((c) =>
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enviados = comunicados.filter((c) => c.status === "enviado").length;
  const agendados = comunicados.filter((c) => c.status === "agendado").length;
  const totalAlcance = comunicados.reduce((acc, c) => acc + c.alcance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Comunicação
          </h1>
          <p className="text-muted-foreground">
            Envio de comunicados, e-mails e notificações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Novo Comunicado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Comunicado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input placeholder="Título do comunicado" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Envio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Notificação Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destinatários</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os membros</SelectItem>
                      <SelectItem value="lideres">Líderes</SelectItem>
                      <SelectItem value="ministerio">Por ministério</SelectItem>
                      <SelectItem value="aniversariantes">Aniversariantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Textarea 
                  placeholder="Digite o conteúdo do comunicado..." 
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Agendamento (opcional)</Label>
                <Input type="datetime-local" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Salvar Rascunho
                </Button>
                <Button className="flex-1 gradient-gold text-primary-foreground">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Agora
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Enviados"
          value={enviados.toString()}
          icon={Send}
          description="Este mês"
          trend="up"
          trendValue="+12"
        />
        <StatCard
          title="Agendados"
          value={agendados.toString()}
          icon={Calendar}
          description="Próximos envios"
          trend="neutral"
        />
        <StatCard
          title="Alcance Total"
          value={totalAlcance.toString()}
          icon={Users}
          description="Pessoas alcançadas"
          trend="up"
          trendValue="+15%"
        />
        <StatCard
          title="Taxa de Abertura"
          value="68%"
          icon={Mail}
          description="Média de e-mails"
          trend="up"
          trendValue="+5%"
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Enviar E-mail</p>
              <p className="text-sm text-muted-foreground">Para membros selecionados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Enviar SMS</p>
              <p className="text-sm text-muted-foreground">Mensagem rápida</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Notificação Push</p>
              <p className="text-sm text-muted-foreground">Para o app da igreja</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar comunicados..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="enviado">Enviados</SelectItem>
                <SelectItem value="agendado">Agendados</SelectItem>
                <SelectItem value="rascunho">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Comunicados */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Comunicados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComunicados.map((comunicado) => {
              const TipoIcon = tipoIcons[comunicado.tipo];

              return (
                <div
                  key={comunicado.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <TipoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{comunicado.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {comunicado.destinatarios} • {comunicado.alcance} pessoas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p>{new Date(comunicado.data).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <Badge className={statusColors[comunicado.status]}>
                      {comunicado.status === "enviado" && "Enviado"}
                      {comunicado.status === "agendado" && "Agendado"}
                      {comunicado.status === "rascunho" && "Rascunho"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
