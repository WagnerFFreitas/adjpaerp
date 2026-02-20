import { useState, useRef } from "react";
import { 
  Shield, 
  Upload, 
  CheckCircle2,
  FileKey,
  Info,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CertificadoDigital() {
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".pfx") && !file.name.endsWith(".p12")) {
        toast.error("Formato inválido. Use arquivos .pfx ou .p12");
        return;
      }
      setCertificateFile(file);
    }
  };

  const handleInstall = async () => {
    if (!certificateFile) {
      toast.error("Selecione um arquivo de certificado");
      return;
    }
    if (!password) {
      toast.error("Informe a senha do certificado");
      return;
    }

    setIsInstalling(true);
    
    // Simular instalação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsInstalling(false);
    setIsInstalled(true);
    toast.success("Certificado A1 instalado com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Identidade Digital (Certificado A1)</CardTitle>
            <CardDescription>
              Necessário para assinar holerites e transmitir ao eSocial.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pfx,.p12"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {certificateFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileKey className="w-10 h-10 text-primary" />
                  <p className="text-sm font-medium">{certificateFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(certificateFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Importar Certificado A1 (.pfx)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-password">Senha do Certificado</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cert-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              onClick={handleInstall}
              disabled={!certificateFile || !password || isInstalling}
              className="w-full"
            >
              {isInstalling ? (
                <>Instalando...</>
              ) : isInstalled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Certificado Instalado
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Instalar Certificado
                </>
              )}
            </Button>
          </div>

          {/* Info Box */}
          <div className="p-6 rounded-lg bg-primary/10 space-y-4">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Info className="w-4 h-4" />
              Segurança
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O certificado A1 permite que o sistema assine digitalmente os 
              holerites, garantindo que o documento tenha validade jurídica sem 
              a necessidade de assinatura manual.
            </p>
            
            {isInstalled && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">Certificado Ativo</p>
                  <p className="text-xs text-emerald-300/70">Válido até: 15/12/2025</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
