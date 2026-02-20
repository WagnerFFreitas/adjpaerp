import { useState, useEffect } from "react";
import { 
  Calculator, 
  Save, 
  Lock,
  FileText,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTaxConfig, FaixaINSS } from "@/contexts/TaxConfigContext";
import { toast } from "sonner";

interface ParametrosFiscaisProps {
  isDeveloper: boolean;
}

export default function ParametrosFiscais({ isDeveloper }: ParametrosFiscaisProps) {
  const { config, updateConfig } = useTaxConfig();
  
  const [tabelaINSS, setTabelaINSS] = useState<FaixaINSS[]>(config.tabelaINSS);
  const [aliquotaFGTS, setAliquotaFGTS] = useState(config.aliquotaFGTS);
  const [aliquotaINSSPatronal, setAliquotaINSSPatronal] = useState(config.aliquotaINSSPatronal);

  useEffect(() => {
    setTabelaINSS(config.tabelaINSS);
    setAliquotaFGTS(config.aliquotaFGTS);
    setAliquotaINSSPatronal(config.aliquotaINSSPatronal);
  }, [config]);

  const handleSave = () => {
    if (!isDeveloper) {
      toast.error("Acesso negado. Apenas desenvolvedores podem alterar alíquotas.");
      return;
    }

    updateConfig({
      tabelaINSS,
      aliquotaFGTS,
      aliquotaINSSPatronal,
    });
    toast.success("Parâmetros fiscais atualizados com sucesso!");
  };

  const updateINSSFaixa = (index: number, field: keyof FaixaINSS, value: number) => {
    if (!isDeveloper) return;
    const newTabela = [...tabelaINSS];
    newTabela[index] = { ...newTabela[index], [field]: value };
    setTabelaINSS(newTabela);
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Parâmetros de Cálculo Fiscais</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-indigo-500/30 text-indigo-300 text-[10px]">
            DEV ONLY
          </Badge>
          <Button 
            onClick={handleSave}
            disabled={!isDeveloper}
            size="sm"
            variant="outline"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Tabelas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isDeveloper && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
              <Lock className="w-6 h-6 text-amber-500" />
              <div>
                <p className="font-medium">Acesso Restrito</p>
                <p className="text-sm text-muted-foreground">
                  Apenas desenvolvedores podem alterar as alíquotas do governo.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tabela INSS */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Tabela Progressiva INSS
            </h4>
            <div className="space-y-3">
              {tabelaINSS.map((faixa, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    type="number"
                    step="0.01"
                    value={faixa.limite}
                    onChange={(e) => updateINSSFaixa(index, "limite", parseFloat(e.target.value) || 0)}
                    className="flex-1"
                    disabled={!isDeveloper}
                  />
                  <div className="w-24 flex items-center gap-1">
                    <Input
                      type="number"
                      step="0.001"
                      value={faixa.aliquota / 100}
                      onChange={(e) => updateINSSFaixa(index, "aliquota", (parseFloat(e.target.value) || 0) * 100)}
                      className="text-center"
                      disabled={!isDeveloper}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encargos Patronais */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Encargos Patronais Fixos
            </h4>
            <div className="p-4 rounded-lg bg-slate-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">FGTS Patronal</Label>
                <div className="w-20">
                  <Input
                    type="number"
                    step="0.01"
                    value={aliquotaFGTS / 100}
                    onChange={(e) => setAliquotaFGTS((parseFloat(e.target.value) || 0) * 100)}
                    className="text-center bg-primary/20 border-primary/30"
                    disabled={!isDeveloper}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">INSS Patronal (Cota)</Label>
                <div className="w-20">
                  <Input
                    type="number"
                    step="0.01"
                    value={aliquotaINSSPatronal / 100}
                    onChange={(e) => setAliquotaINSSPatronal((parseFloat(e.target.value) || 0) * 100)}
                    className="text-center bg-primary/20 border-primary/30"
                    disabled={!isDeveloper}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
