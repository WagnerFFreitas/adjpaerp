import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Save,
  FileText,
  User,
  Briefcase,
  Calendar,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { useTaxCalculations } from "@/contexts/TaxConfigContext";

// Mock do funcionário
const funcionarioMock = {
  id: "1",
  nome: "Maria Silva Santos",
  cpf: "123.456.789-00",
  cargo: "Analista Financeiro",
  departamento: "Financeiro",
  dataAdmissao: "2022-03-15",
  salarioBase: 5500.00,
  dependentes: 2,
  valeTransporte: true,
  valeAlimentacao: true,
  planoSaude: true,
  planoOdontologico: false,
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function CalculoFolha() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { calcularINSS, calcularIRRF, calcularFGTS, calcularINSSPatronal, calcularValeTransporte, config } = useTaxCalculations();
  
  const [funcionario] = useState(funcionarioMock);
  const [competencia, setCompetencia] = useState("01/2024");
  
  // Proventos
  const [salarioBase, setSalarioBase] = useState(funcionario.salarioBase);
  const [horasExtras50, setHorasExtras50] = useState(0);
  const [horasExtras100, setHorasExtras100] = useState(0);
  const [adicionalNoturno, setAdicionalNoturno] = useState(0);
  const [comissao, setComissao] = useState(0);
  const [gratificacao, setGratificacao] = useState(0);
  const [dsrHorasExtras, setDsrHorasExtras] = useState(true);
  const [insalubridade, setInsalubridade] = useState<"none" | "10" | "20" | "40">("none");
  const [periculosidade, setPericulosidade] = useState(false);
  
  // Benefícios
  const [valeTransporte, setValeTransporte] = useState(funcionario.valeTransporte);
  const [valorVT, setValorVT] = useState(220.00);
  const [valeAlimentacao, setValeAlimentacao] = useState(funcionario.valeAlimentacao);
  const [valorVA, setValorVA] = useState(660.00);
  const [valeRefeicao, setValeRefeicao] = useState(false);
  const [valorVR, setValorVR] = useState(0);
  const [planoSaude, setPlanoSaude] = useState(funcionario.planoSaude);
  const [valorPlanoSaude, setValorPlanoSaude] = useState(350.00);
  const [planoOdonto, setPlanoOdonto] = useState(funcionario.planoOdontologico);
  const [valorPlanoOdonto, setValorPlanoOdonto] = useState(45.00);
  
  // Outros descontos
  const [faltas, setFaltas] = useState(0);
  const [atrasos, setAtrasos] = useState(0);
  const [adiantamento, setAdiantamento] = useState(0);
  const [pensaoAlimenticia, setPensaoAlimenticia] = useState(0);
  const [outrosDescontos, setOutrosDescontos] = useState(0);
  const [emprestimo, setEmprestimo] = useState(0);
  
  // Dependentes IRRF
  const [dependentes, setDependentes] = useState(funcionario.dependentes);

  // Cálculos
  const calculos = useMemo(() => {
    const salarioHora = salarioBase / 220;
    
    // Proventos
    const valorHE50 = horasExtras50 * salarioHora * 1.5;
    const valorHE100 = horasExtras100 * salarioHora * 2;
    const valorAdicNoturno = adicionalNoturno * salarioHora * 0.2;
    
    // DSR sobre horas extras (considerando 6 dias úteis por semana)
    const dsrValue = dsrHorasExtras ? (valorHE50 + valorHE100) / 6 : 0;
    
    // Insalubridade (calculada sobre salário mínimo)
    const salarioMinimo = 1412.00;
    let valorInsalubridade = 0;
    if (insalubridade === "10") valorInsalubridade = salarioMinimo * 0.1;
    if (insalubridade === "20") valorInsalubridade = salarioMinimo * 0.2;
    if (insalubridade === "40") valorInsalubridade = salarioMinimo * 0.4;
    
    // Periculosidade (30% do salário base)
    const valorPericulosidade = periculosidade ? salarioBase * 0.3 : 0;
    
    const totalProventos = 
      salarioBase + 
      valorHE50 + 
      valorHE100 + 
      valorAdicNoturno + 
      dsrValue +
      comissao + 
      gratificacao + 
      valorInsalubridade + 
      valorPericulosidade;
    
    // Descontos
    const valorFaltas = faltas * (salarioBase / 30);
    const valorAtrasos = atrasos * salarioHora;
    
    // VT desconto (usando limite da configuração)
    const descontoVT = valeTransporte ? calcularValeTransporte(salarioBase, valorVT) : 0;
    
    // Base INSS
    const baseINSS = totalProventos - valorFaltas - valorAtrasos;
    const inss = calcularINSS(baseINSS);
    
    // Base IRRF (Salário - INSS - Pensão - Dependentes)
    const baseIRRF = baseINSS - inss - pensaoAlimenticia;
    const irrf = calcularIRRF(baseIRRF, dependentes);
    
    // Total descontos
    const totalDescontos = 
      inss + 
      irrf + 
      descontoVT + 
      (planoSaude ? valorPlanoSaude : 0) +
      (planoOdonto ? valorPlanoOdonto : 0) +
      valorFaltas + 
      valorAtrasos + 
      adiantamento + 
      pensaoAlimenticia + 
      emprestimo +
      outrosDescontos;
    
    // Líquido
    const liquido = totalProventos - totalDescontos;
    
    // FGTS (usando alíquota configurável)
    const fgts = calcularFGTS(totalProventos);
    
    // INSS Patronal (usando alíquota configurável)
    const inssPatronal = calcularINSSPatronal(totalProventos);
    
    return {
      salarioHora,
      valorHE50,
      valorHE100,
      valorAdicNoturno,
      dsrValue,
      valorInsalubridade,
      valorPericulosidade,
      totalProventos,
      valorFaltas,
      valorAtrasos,
      descontoVT,
      inss,
      baseINSS,
      baseIRRF,
      irrf,
      totalDescontos,
      liquido,
      fgts,
      inssPatronal,
    };
  }, [
    salarioBase, horasExtras50, horasExtras100, adicionalNoturno, dsrHorasExtras,
    comissao, gratificacao, insalubridade, periculosidade,
    faltas, atrasos, valeTransporte, valorVT, planoSaude, valorPlanoSaude,
    planoOdonto, valorPlanoOdonto, adiantamento, pensaoAlimenticia, emprestimo,
    outrosDescontos, dependentes, calcularINSS, calcularIRRF, calcularFGTS, 
    calcularINSSPatronal, calcularValeTransporte, config
  ]);

  const handleSalvar = () => {
    toast({
      title: "Folha calculada com sucesso!",
      description: `Folha de ${funcionario.nome} para competência ${competencia}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Cálculo de Folha de Pagamento
          </h1>
          <p className="text-muted-foreground">
            Processamento individual de folha com todos os encargos
          </p>
        </div>
        <Select value={competencia} onValueChange={setCompetencia}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01/2024">Jan/2024</SelectItem>
            <SelectItem value="02/2024">Fev/2024</SelectItem>
            <SelectItem value="03/2024">Mar/2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dados do Funcionário */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>{funcionario.nome}</CardTitle>
              <CardDescription className="flex gap-4 mt-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {funcionario.cargo}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString("pt-BR")}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Esquerda - Proventos e Descontos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proventos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Plus className="w-5 h-5" />
                Proventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salarioBase">Salário Base</Label>
                  <Input
                    id="salarioBase"
                    type="number"
                    step="0.01"
                    value={salarioBase}
                    onChange={(e) => setSalarioBase(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Hora: {formatCurrency(calculos.salarioHora)}</Label>
                  <p className="text-sm text-muted-foreground">Base: 220 horas/mês</p>
                </div>
              </div>

              <Separator />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="he50">Horas Extras 50% (qtd)</Label>
                  <Input
                    id="he50"
                    type="number"
                    value={horasExtras50}
                    onChange={(e) => setHorasExtras50(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor: {formatCurrency(calculos.valorHE50)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="he100">Horas Extras 100% (qtd)</Label>
                  <Input
                    id="he100"
                    type="number"
                    value={horasExtras100}
                    onChange={(e) => setHorasExtras100(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor: {formatCurrency(calculos.valorHE100)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dsr"
                  checked={dsrHorasExtras}
                  onCheckedChange={setDsrHorasExtras}
                />
                <Label htmlFor="dsr">Calcular DSR sobre horas extras</Label>
                {dsrHorasExtras && (
                  <Badge variant="outline" className="ml-2">
                    {formatCurrency(calculos.dsrValue)}
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adicNoturno">Horas Adicional Noturno (qtd)</Label>
                  <Input
                    id="adicNoturno"
                    type="number"
                    value={adicionalNoturno}
                    onChange={(e) => setAdicionalNoturno(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor (20%): {formatCurrency(calculos.valorAdicNoturno)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comissao">Comissão</Label>
                  <Input
                    id="comissao"
                    type="number"
                    step="0.01"
                    value={comissao}
                    onChange={(e) => setComissao(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gratificacao">Gratificação</Label>
                  <Input
                    id="gratificacao"
                    type="number"
                    step="0.01"
                    value={gratificacao}
                    onChange={(e) => setGratificacao(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Insalubridade</Label>
                  <Select value={insalubridade} onValueChange={(v) => setInsalubridade(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não se aplica</SelectItem>
                      <SelectItem value="10">10% (Grau Mínimo)</SelectItem>
                      <SelectItem value="20">20% (Grau Médio)</SelectItem>
                      <SelectItem value="40">40% (Grau Máximo)</SelectItem>
                    </SelectContent>
                  </Select>
                  {insalubridade !== "none" && (
                    <p className="text-xs text-muted-foreground">
                      Valor: {formatCurrency(calculos.valorInsalubridade)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="periculosidade"
                  checked={periculosidade}
                  onCheckedChange={setPericulosidade}
                />
                <Label htmlFor="periculosidade">Periculosidade (30%)</Label>
                {periculosidade && (
                  <Badge variant="outline" className="ml-2">
                    {formatCurrency(calculos.valorPericulosidade)}
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="font-semibold text-green-700 dark:text-green-300">Total Proventos</span>
                <span className="text-xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(calculos.totalProventos)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <DollarSign className="w-5 h-5" />
                Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vt"
                        checked={valeTransporte}
                        onCheckedChange={setValeTransporte}
                      />
                      <Label htmlFor="vt">Vale-Transporte</Label>
                    </div>
                  </div>
                  {valeTransporte && (
                    <div className="pl-8 space-y-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={valorVT}
                        onChange={(e) => setValorVT(Number(e.target.value))}
                        placeholder="Valor VT"
                      />
                      <p className="text-xs text-muted-foreground">
                        Desconto (6%): {formatCurrency(calculos.descontoVT)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="va"
                        checked={valeAlimentacao}
                        onCheckedChange={setValeAlimentacao}
                      />
                      <Label htmlFor="va">Vale-Alimentação</Label>
                    </div>
                  </div>
                  {valeAlimentacao && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        step="0.01"
                        value={valorVA}
                        onChange={(e) => setValorVA(Number(e.target.value))}
                        placeholder="Valor VA"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vr"
                      checked={valeRefeicao}
                      onCheckedChange={setValeRefeicao}
                    />
                    <Label htmlFor="vr">Vale-Refeição</Label>
                  </div>
                  {valeRefeicao && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        step="0.01"
                        value={valorVR}
                        onChange={(e) => setValorVR(Number(e.target.value))}
                        placeholder="Valor VR"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ps"
                      checked={planoSaude}
                      onCheckedChange={setPlanoSaude}
                    />
                    <Label htmlFor="ps">Plano de Saúde</Label>
                  </div>
                  {planoSaude && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        step="0.01"
                        value={valorPlanoSaude}
                        onChange={(e) => setValorPlanoSaude(Number(e.target.value))}
                        placeholder="Desconto Plano"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="po"
                      checked={planoOdonto}
                      onCheckedChange={setPlanoOdonto}
                    />
                    <Label htmlFor="po">Plano Odontológico</Label>
                  </div>
                  {planoOdonto && (
                    <div className="pl-8">
                      <Input
                        type="number"
                        step="0.01"
                        value={valorPlanoOdonto}
                        onChange={(e) => setValorPlanoOdonto(Number(e.target.value))}
                        placeholder="Desconto Plano"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descontos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Minus className="w-5 h-5" />
                Descontos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="faltas">Faltas (dias)</Label>
                  <Input
                    id="faltas"
                    type="number"
                    value={faltas}
                    onChange={(e) => setFaltas(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor: {formatCurrency(calculos.valorFaltas)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="atrasos">Atrasos (horas)</Label>
                  <Input
                    id="atrasos"
                    type="number"
                    step="0.5"
                    value={atrasos}
                    onChange={(e) => setAtrasos(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor: {formatCurrency(calculos.valorAtrasos)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependentes">Dependentes IRRF</Label>
                  <Input
                    id="dependentes"
                    type="number"
                    value={dependentes}
                    onChange={(e) => setDependentes(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Dedução: {formatCurrency(dependentes * config.deducaoDependenteIRRF)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adiantamento">Adiantamento</Label>
                  <Input
                    id="adiantamento"
                    type="number"
                    step="0.01"
                    value={adiantamento}
                    onChange={(e) => setAdiantamento(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pensao">Pensão Alimentícia</Label>
                  <Input
                    id="pensao"
                    type="number"
                    step="0.01"
                    value={pensaoAlimenticia}
                    onChange={(e) => setPensaoAlimenticia(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emprestimo">Empréstimo Consignado</Label>
                  <Input
                    id="emprestimo"
                    type="number"
                    step="0.01"
                    value={emprestimo}
                    onChange={(e) => setEmprestimo(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outros">Outros Descontos</Label>
                  <Input
                    id="outros"
                    type="number"
                    step="0.01"
                    value={outrosDescontos}
                    onChange={(e) => setOutrosDescontos(Number(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Base INSS:</span>
                  <span>{formatCurrency(calculos.baseINSS)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>INSS (progressivo):</span>
                  <span className="text-red-600">-{formatCurrency(calculos.inss)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Base IRRF:</span>
                  <span>{formatCurrency(calculos.baseIRRF)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IRRF:</span>
                  <span className="text-red-600">-{formatCurrency(calculos.irrf)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <span className="font-semibold text-red-700 dark:text-red-300">Total Descontos</span>
                <span className="text-xl font-bold text-red-700 dark:text-red-300">
                  -{formatCurrency(calculos.totalDescontos)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Resumo */}
        <div className="space-y-6">
          {/* Resumo Final */}
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Resumo da Folha
              </CardTitle>
              <CardDescription>Competência: {competencia}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Proventos</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {formatCurrency(calculos.totalProventos)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Descontos</TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">
                      -{formatCurrency(calculos.totalDescontos)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold text-lg">Líquido a Receber</TableCell>
                    <TableCell className="text-right text-primary font-bold text-lg">
                      {formatCurrency(calculos.liquido)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Encargos Patronais</h4>
                <div className="flex justify-between text-sm">
                  <span>FGTS (8%)</span>
                  <span>{formatCurrency(calculos.fgts)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>INSS Patronal (23%)</span>
                  <span>{formatCurrency(calculos.inssPatronal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Custo Total Empresa</span>
                  <span className="text-primary">
                    {formatCurrency(calculos.totalProventos + calculos.fgts + calculos.inssPatronal)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Button className="w-full gradient-gold" onClick={handleSalvar}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Folha
                </Button>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar Folha
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Holerite
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Tabelas atualizadas</p>
                  <p className="text-muted-foreground">
                    INSS e IRRF conforme tabelas de 2024. Salário mínimo: R$ 1.412,00.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
