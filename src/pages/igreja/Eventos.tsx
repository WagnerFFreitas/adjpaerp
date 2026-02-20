import { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventos = [
  {
    id: 1,
    titulo: "Culto de Celebração",
    data: "12/01/2026",
    horario: "19:00",
    local: "Templo Principal",
    tipo: "Culto",
    responsavel: "Pr. João Silva",
    participantes: 250,
  },
  {
    id: 2,
    titulo: "Reunião de Oração",
    data: "13/01/2026",
    horario: "06:00",
    local: "Sala de Oração",
    tipo: "Oração",
    responsavel: "Dc. Maria Santos",
    participantes: 45,
  },
  {
    id: 3,
    titulo: "Escola Bíblica Dominical",
    data: "14/01/2026",
    horario: "09:00",
    local: "Salas de EBD",
    tipo: "EBD",
    responsavel: "Prof. Carlos Lima",
    participantes: 180,
  },
  {
    id: 4,
    titulo: "Culto de Jovens",
    data: "14/01/2026",
    horario: "18:00",
    local: "Templo Principal",
    tipo: "Jovens",
    responsavel: "Pb. Pedro Costa",
    participantes: 120,
  },
  {
    id: 5,
    titulo: "Ensaio do Coral",
    data: "15/01/2026",
    horario: "20:00",
    local: "Sala de Ensaio",
    tipo: "Ministério",
    responsavel: "Min. Ana Paula",
    participantes: 30,
  },
  {
    id: 6,
    titulo: "Conferência de Mulheres",
    data: "18/01/2026",
    horario: "14:00",
    local: "Templo Principal",
    tipo: "Conferência",
    responsavel: "Pra. Fernanda",
    participantes: 300,
  },
];

const tipoColors: Record<string, string> = {
  "Culto": "bg-primary/10 text-primary border-primary/20",
  "Oração": "bg-secondary/10 text-secondary border-secondary/20",
  "EBD": "bg-info/10 text-info border-info/20",
  "Jovens": "bg-success/10 text-success border-success/20",
  "Ministério": "bg-warning/10 text-warning border-warning/20",
  "Conferência": "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Eventos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mesAtual, setMesAtual] = useState("Janeiro 2026");

  // Generate calendar days (simplified)
  const diasCalendario = Array.from({ length: 35 }, (_, i) => {
    const dia = i - 2; // Offset for the month starting
    return {
      dia: dia > 0 && dia <= 31 ? dia : null,
      eventos: dia === 12 ? 2 : dia === 14 ? 2 : dia === 18 ? 1 : 0,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Eventos e Agenda</h1>
          <p className="page-subtitle">Gerencie cultos, reuniões e eventos especiais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Evento</DialogTitle>
              <DialogDescription>
                Adicione um novo evento à agenda da igreja
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Título do Evento *</Label>
                <Input placeholder="Nome do evento" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Horário *</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Evento *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="culto">Culto</SelectItem>
                    <SelectItem value="oracao">Reunião de Oração</SelectItem>
                    <SelectItem value="ebd">EBD</SelectItem>
                    <SelectItem value="jovens">Culto de Jovens</SelectItem>
                    <SelectItem value="ministerio">Evento de Ministério</SelectItem>
                    <SelectItem value="conferencia">Conferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Local</Label>
                <Input placeholder="Local do evento" />
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input placeholder="Nome do responsável" />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descrição do evento" rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="gold" onClick={() => setIsDialogOpen(false)}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{mesAtual}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {diasSemana.map((dia) => (
                <div
                  key={dia}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {diasCalendario.map((item, index) => (
                <div
                  key={index}
                  className={`aspect-square p-1 rounded-lg border border-transparent hover:border-border transition-colors ${
                    item.dia ? "cursor-pointer hover:bg-muted/50" : ""
                  } ${item.dia === 13 ? "bg-primary/10 border-primary/20" : ""}`}
                >
                  {item.dia && (
                    <div className="h-full flex flex-col">
                      <span className={`text-sm ${item.dia === 13 ? "font-bold text-primary" : ""}`}>
                        {item.dia}
                      </span>
                      {item.eventos > 0 && (
                        <div className="mt-auto">
                          <div className="flex gap-0.5">
                            {Array.from({ length: Math.min(item.eventos, 3) }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-secondary"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Próximos Eventos</h2>
          <div className="space-y-3">
            {eventos.slice(0, 4).map((evento) => (
              <div
                key={evento.id}
                className="card-elevated p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={tipoColors[evento.tipo]}>{evento.tipo}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
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
                </div>
                <h3 className="font-medium mb-2">{evento.titulo}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {evento.data}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {evento.horario}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {evento.local}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {evento.participantes} participantes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">Todos os Eventos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Evento</th>
                <th className="pb-3 font-medium">Data/Horário</th>
                <th className="pb-3 font-medium">Local</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">Responsável</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id} className="border-b last:border-0 table-row-hover">
                  <td className="py-4 font-medium">{evento.titulo}</td>
                  <td className="py-4">
                    <div className="text-sm">
                      <div>{evento.data}</div>
                      <div className="text-muted-foreground">{evento.horario}</div>
                    </div>
                  </td>
                  <td className="py-4">{evento.local}</td>
                  <td className="py-4">
                    <Badge className={tipoColors[evento.tipo]}>{evento.tipo}</Badge>
                  </td>
                  <td className="py-4">{evento.responsavel}</td>
                  <td className="py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
