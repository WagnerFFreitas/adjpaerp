import { useState } from "react";
import { 
  MapPin, 
  Download, 
  Database,
  CheckCircle2,
  Shield,
  Lock,
  Globe,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

interface CEPEngineProps {
  isDeveloper: boolean;
}

export default function CEPEngine({ isDeveloper }: CEPEngineProps) {
  const [selectedState, setSelectedState] = useState("RJ");
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    if (!isDeveloper) {
      toast.error("Acesso negado. Apenas desenvolvedores podem sincronizar CEPs.");
      return;
    }

    setIsSyncing(true);
    setProgress(0);

    // Simular sincronização
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i);
    }

    setIsSyncing(false);
    toast.success(`CEPs do estado ${selectedState} atualizados com sucesso!`);
  };

  const estadoSelecionado = ESTADOS_BRASIL.find(e => e.sigla === selectedState);

  return (
    <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 to-indigo-950/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <Globe className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-white">Engine de Logradouros (Atualização Brasil)</CardTitle>
                <Badge variant="secondary" className="bg-indigo-500/30 text-indigo-300 text-[10px]">
                  DEV ONLY
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Sincronização massiva da base nacional de CEPs por Unidade Federativa.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {!isDeveloper && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-300">
              Esta funcionalidade está restrita a desenvolvedores autorizados.
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider">
                Selecione o Estado para Sincronizar
              </label>
              <Select 
                value={selectedState} 
                onValueChange={setSelectedState}
                disabled={!isDeveloper}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BRASIL.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome} ({estado.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSync}
              disabled={!isDeveloper || isSyncing}
              className="w-full bg-indigo-600 hover:bg-indigo-500"
            >
              <Download className="w-4 h-4 mr-2" />
              {isSyncing ? "Sincronizando..." : `Atualizar CEPs: ${selectedState}`}
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Status da Indexação Local
              </span>
              <span className="text-xs text-slate-500">
                Última Atualização: 15/05/2024
              </span>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-white">
                Estado: {estadoSelecionado?.nome || selectedState}
              </p>
              {isSyncing ? (
                <Progress value={progress} className="mt-2" />
              ) : (
                <Progress value={100} className="mt-2" />
              )}
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700/50">
          <div className="p-3 rounded-lg bg-slate-800/30 text-center">
            <p className="text-xs text-slate-400 uppercase">Registros</p>
            <p className="text-lg font-bold text-white">+250k</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30 text-center">
            <p className="text-xs text-slate-400 uppercase">GeoJSON</p>
            <p className="text-lg font-bold text-emerald-400">Ativo</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30 text-center">
            <p className="text-xs text-slate-400 uppercase">Protocolo</p>
            <p className="text-lg font-bold text-white">HTTPS/2</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30 text-center">
            <p className="text-xs text-slate-400 uppercase">Cripto</p>
            <p className="text-lg font-bold text-violet-400">AES-256</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
          <Shield className="w-3 h-3" />
          <span>Ferramenta de Manutenção Reservada • Acesso do Desenvolvedor Verificado</span>
        </div>
      </CardContent>
    </Card>
  );
}
