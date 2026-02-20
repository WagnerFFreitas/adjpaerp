import { useState } from "react";
import { 
  Calculator, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Percent,
  DollarSign,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTaxConfig, FaixaINSS, FaixaIRRF } from "@/contexts/TaxConfigContext";
import { toast } from "sonner";

const formatCurrency = (value: number) => {
  if (value === Infinity) return "Acima";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function TabelasTributarias() {
  const { config, updateConfig, resetToDefaults } = useTaxConfig();
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // Estado local para edição
  const [tabelaINSS, setTabelaINSS] = useState<FaixaINSS[]>(config.tabelaINSS);
  const [tetoINSS, setTetoINSS] = useState(config.tetoINSS);
  const [tabelaIRRF, setTabelaIRRF] = useState<FaixaIRRF[]>(config.tabelaIRRF);
  const [deducaoDependente, setDeducaoDependente] = useState(config.deducaoDependenteIRRF);
  const [aliquotaFGTS, setAliquotaFGTS] = useState(config.aliquotaFGTS);
  const [aliquotaINSSPatronal, setAliquotaINSSPatronal] = useState(config.aliquotaINSSPatronal);
  const [limiteVT, setLimiteVT] = useState(config.limiteValeTransporte);

  const handleSave = () => {
    updateConfig({
      tabelaINSS,
      tetoINSS,
      tabelaIRRF,
      deducaoDependenteIRRF: deducaoDependente,
      aliquotaFGTS,
      aliquotaINSSPatronal,
      limiteValeTransporte: limiteVT,
    });
    toast.success("Tabelas tributárias atualizadas com sucesso!");
  };

  const handleReset = () => {
    resetToDefaults();
    setTabelaINSS(config.tabelaINSS);
    setTetoINSS(config.tetoINSS);
    setTabelaIRRF(config.tabelaIRRF);
    setDeducaoDependente(config.deducaoDependenteIRRF);
    setAliquotaFGTS(config.aliquotaFGTS);
    setAliquotaINSSPatronal(config.aliquotaINSSPatronal);
    setLimiteVT(config.limiteValeTransporte);
    setShowResetDialog(false);
    toast.info("Tabelas restauradas para os valores padrão de 2024");
  };

  const updateINSSFaixa = (index: number, field: keyof FaixaINSS, value: number) => {
    const newTabela = [...tabelaINSS];
    newTabela[index] = { ...newTabela[index], [field]: value };
    setTabelaINSS(newTabela);
  };

  const updateIRRFFaixa = (index: number, field: keyof FaixaIRRF, value: number) => {
    const newTabela = [...tabelaIRRF];
    newTabela[index] = { ...newTabela[index], [field]: value };
    setTabelaIRRF(newTabela);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Tabelas Tributárias</AlertTitle>
        <AlertDescription>
          Configure as alíquotas de INSS, IRRF e FGTS conforme a legislação vigente. 
          Última atualização: {new Date(config.ultimaAtualizacao).toLocaleDateString("pt-BR")}
        </AlertDescription>
      </Alert>

      {/* Tabela INSS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Tabela INSS (Contribuição do Empregado)
          </CardTitle>
          <CardDescription>
            Alíquotas progressivas para cálculo do INSS descontado do funcionário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faixa</TableHead>
                <TableHead>Limite Superior (R$)</TableHead>
                <TableHead>Alíquota (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabelaINSS.map((faixa, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}ª Faixa</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={faixa.limite}
                      onChange={(e) => updateINSSFaixa(index, "limite", parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={faixa.aliquota}
                        onChange={(e) => updateINSSFaixa(index, "aliquota", parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Percent className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label>Teto de Contribuição (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={tetoINSS}
                onChange={(e) => setTetoINSS(parseFloat(e.target.value) || 0)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela IRRF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Tabela IRRF (Imposto de Renda)
          </CardTitle>
          <CardDescription>
            Alíquotas e deduções para cálculo do Imposto de Renda Retido na Fonte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faixa</TableHead>
                <TableHead>Limite Superior (R$)</TableHead>
                <TableHead>Alíquota (%)</TableHead>
                <TableHead>Dedução (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabelaIRRF.map((faixa, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index === tabelaIRRF.length - 1 ? "Acima" : `${index + 1}ª Faixa`}
                  </TableCell>
                  <TableCell>
                    {faixa.limite === Infinity ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <Input
                        type="number"
                        step="0.01"
                        value={faixa.limite}
                        onChange={(e) => updateIRRFFaixa(index, "limite", parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={faixa.aliquota}
                        onChange={(e) => updateIRRFFaixa(index, "aliquota", parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Percent className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={faixa.deducao}
                      onChange={(e) => updateIRRFFaixa(index, "deducao", parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2">
            <Label>Dedução por Dependente (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={deducaoDependente}
              onChange={(e) => setDeducaoDependente(parseFloat(e.target.value) || 0)}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outras Alíquotas */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Alíquotas</CardTitle>
          <CardDescription>
            Configure alíquotas de FGTS, INSS Patronal e limite de desconto de VT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>FGTS (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={aliquotaFGTS}
                  onChange={(e) => setAliquotaFGTS(parseFloat(e.target.value) || 0)}
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Padrão: 8%</p>
            </div>

            <div className="space-y-2">
              <Label>INSS Patronal (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={aliquotaINSSPatronal}
                  onChange={(e) => setAliquotaINSSPatronal(parseFloat(e.target.value) || 0)}
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Padrão: 23% (20% + RAT)</p>
            </div>

            <div className="space-y-2">
              <Label>Limite Vale-Transporte (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={limiteVT}
                  onChange={(e) => setLimiteVT(parseFloat(e.target.value) || 0)}
                />
                <Percent className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Padrão: 6%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between">
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrões
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Restaurar Valores Padrão
              </DialogTitle>
              <DialogDescription>
                Isso irá restaurar todas as tabelas tributárias para os valores padrão 
                de 2024. Todas as alterações feitas serão perdidas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleReset}>
                Restaurar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={handleSave} className="gradient-gold text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
