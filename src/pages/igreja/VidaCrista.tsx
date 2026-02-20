import { useState } from "react";
import { 
  BookOpen, 
  Heart, 
  Users, 
  Calendar,
  GraduationCap,
  Baby,
  Sparkles,
  Award,
  Plus,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Batismo {
  id: string;
  nome: string;
  data: string;
  pastor: string;
  tipo: "aguas" | "espirito_santo";
}

interface Casamento {
  id: string;
  noivo: string;
  noiva: string;
  data: string;
  pastor: string;
  local: string;
}

interface Apresentacao {
  id: string;
  crianca: string;
  pais: string;
  data: string;
  pastor: string;
}

interface Discipulado {
  id: string;
  aluno: string;
  discipulador: string;
  inicio: string;
  status: "em_andamento" | "concluido" | "pausado";
  modulo: string;
}

const batismos: Batismo[] = [
  { id: "1", nome: "João Pedro Silva", data: "2024-01-15", pastor: "Pr. Carlos", tipo: "aguas" },
  { id: "2", nome: "Maria Clara Santos", data: "2024-01-15", pastor: "Pr. Carlos", tipo: "aguas" },
  { id: "3", nome: "Ana Paula Costa", data: "2024-01-22", pastor: "Pr. Roberto", tipo: "espirito_santo" },
];

const casamentos: Casamento[] = [
  { id: "1", noivo: "Lucas Ferreira", noiva: "Juliana Almeida", data: "2024-02-10", pastor: "Pr. Carlos", local: "Templo Sede" },
  { id: "2", noivo: "Pedro Santos", noiva: "Camila Oliveira", data: "2024-03-22", pastor: "Pr. Roberto", local: "Salão de Festas" },
];

const apresentacoes: Apresentacao[] = [
  { id: "1", crianca: "Davi Santos", pais: "José e Maria Santos", data: "2024-01-07", pastor: "Pr. Carlos" },
  { id: "2", crianca: "Sofia Oliveira", pais: "Pedro e Ana Oliveira", data: "2024-01-14", pastor: "Pr. Roberto" },
];

const discipulados: Discipulado[] = [
  { id: "1", aluno: "Carlos Eduardo", discipulador: "Dc. Paulo", inicio: "2024-01-01", status: "em_andamento", modulo: "Fundamentos da Fé" },
  { id: "2", aluno: "Fernanda Lima", discipulador: "Dca. Ana", inicio: "2023-11-15", status: "em_andamento", modulo: "Vida de Oração" },
  { id: "3", aluno: "Ricardo Souza", discipulador: "Dc. Pedro", inicio: "2023-09-01", status: "concluido", modulo: "Liderança" },
];

const statusColors: Record<string, string> = {
  em_andamento: "bg-green-100 text-green-800",
  concluido: "bg-blue-100 text-blue-800",
  pausado: "bg-yellow-100 text-yellow-800",
};

export default function VidaCrista() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Vida Cristã
          </h1>
          <p className="text-muted-foreground">
            Batismos, casamentos, apresentações e discipulado
          </p>
        </div>
        <Button className="gradient-gold text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Batismos no Ano"
          value="45"
          icon={Sparkles}
          description="12 nas águas, 33 Espírito Santo"
          trend="up"
          trendValue="+15%"
        />
        <StatCard
          title="Casamentos"
          value="8"
          icon={Heart}
          description="Realizados este ano"
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title="Apresentações"
          value="23"
          icon={Baby}
          description="Crianças apresentadas"
          trend="up"
          trendValue="+5"
        />
        <StatCard
          title="Discipulados"
          value="34"
          icon={GraduationCap}
          description="18 em andamento"
          trend="up"
          trendValue="+8"
        />
      </div>

      {/* Próximos Eventos */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <Calendar className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="font-medium">Próximo Batismo nas Águas</p>
            <p className="text-sm text-muted-foreground">
              15 de Fevereiro de 2024 • 15 candidatos inscritos
            </p>
          </div>
          <Button variant="outline" size="sm">
            Ver Inscrições
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="batismos">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="batismos" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Batismos
          </TabsTrigger>
          <TabsTrigger value="casamentos" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Casamentos
          </TabsTrigger>
          <TabsTrigger value="apresentacoes" className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            Apresentações
          </TabsTrigger>
          <TabsTrigger value="discipulado" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Discipulado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batismos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Batismos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Pastor Oficiante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batismos.map((batismo) => (
                    <TableRow key={batismo.id}>
                      <TableCell className="font-medium">{batismo.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {batismo.tipo === "aguas" ? "Nas Águas" : "Espírito Santo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(batismo.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{batismo.pastor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="casamentos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Casamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Noivo</TableHead>
                    <TableHead>Noiva</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Pastor Oficiante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casamentos.map((casamento) => (
                    <TableRow key={casamento.id}>
                      <TableCell className="font-medium">{casamento.noivo}</TableCell>
                      <TableCell className="font-medium">{casamento.noiva}</TableCell>
                      <TableCell>{new Date(casamento.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{casamento.local}</TableCell>
                      <TableCell>{casamento.pastor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apresentacoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Apresentações de Crianças</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criança</TableHead>
                    <TableHead>Pais</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Pastor Oficiante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apresentacoes.map((apresentacao) => (
                    <TableRow key={apresentacao.id}>
                      <TableCell className="font-medium">{apresentacao.crianca}</TableCell>
                      <TableCell>{apresentacao.pais}</TableCell>
                      <TableCell>{new Date(apresentacao.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{apresentacao.pastor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discipulado" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Programa de Discipulado</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Discipulador</TableHead>
                    <TableHead>Módulo Atual</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discipulados.map((disc) => (
                    <TableRow key={disc.id}>
                      <TableCell className="font-medium">{disc.aluno}</TableCell>
                      <TableCell>{disc.discipulador}</TableCell>
                      <TableCell>{disc.modulo}</TableCell>
                      <TableCell>{new Date(disc.inicio).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[disc.status]}>
                          {disc.status === "em_andamento" && "Em Andamento"}
                          {disc.status === "concluido" && "Concluído"}
                          {disc.status === "pausado" && "Pausado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
