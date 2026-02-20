import { useState } from "react";
import { 
  Shield, 
  Download, 
  Upload, 
  Database,
  Clock,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function SecurityBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      // Simular exportação de backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cria um arquivo JSON com dados do localStorage
      const backupData = {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        taxConfig: localStorage.getItem("gestaoplus_tax_config"),
        settings: localStorage.getItem("gestaoplus_settings"),
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_gestaoplus_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Backup exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar backup");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreBackup = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsRestoring(true);
      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        if (backupData.taxConfig) {
          localStorage.setItem("gestaoplus_tax_config", backupData.taxConfig);
        }
        if (backupData.settings) {
          localStorage.setItem("gestaoplus_settings", backupData.settings);
        }
        
        toast.success("Backup restaurado com sucesso! Recarregue a página.");
      } catch (error) {
        toast.error("Erro ao restaurar backup. Arquivo inválido.");
      } finally {
        setIsRestoring(false);
      }
    };
    
    input.click();
  };

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-card to-amber-950/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Shield className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <CardTitle>Segurança de Dados & Backup</CardTitle>
            <CardDescription>
              Como este sistema funciona localmente no seu navegador, a limpeza do cache pode apagar os dados.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="border-amber-500/30 bg-amber-500/10">
          <Info className="w-4 h-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            <strong>Realize um backup semanal</strong> para garantir a segurança das informações da igreja.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleExportBackup}
            disabled={isExporting}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exportando..." : "Baixar Cópia de Segurança"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleRestoreBackup}
            disabled={isRestoring}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isRestoring ? "Restaurando..." : "Restaurar Backup"}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Clock className="w-3 h-3" />
          <span>Último backup: Não registrado</span>
        </div>
      </CardContent>
    </Card>
  );
}
