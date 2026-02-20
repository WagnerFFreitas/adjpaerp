import { useState } from "react";
import { 
  Settings, 
  Building2, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Mail,
  Save,
  Upload,
  Key,
  Calculator,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import TabelasTributarias from "@/components/configuracoes/TabelasTributarias";
import SecurityBackup from "@/components/configuracoes/SecurityBackup";
import CEPEngine from "@/components/configuracoes/CEPEngine";
import CertificadoDigital from "@/components/configuracoes/CertificadoDigital";
import ParametrosFiscais from "@/components/configuracoes/ParametrosFiscais";

export default function Configuracoes() {
  const { hasRole, roles } = useAuth();
  const isDeveloper = roles.includes('developer');

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="empresa">
        <TabsList className={`grid w-full ${isDeveloper ? 'grid-cols-7' : 'grid-cols-6'}`}>
          <TabsTrigger value="empresa" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="tributario" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Tributário</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
          {isDeveloper && (
            <TabsTrigger value="desenvolvedor" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Dev</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Empresa */}
        <TabsContent value="empresa" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Igreja</CardTitle>
              <CardDescription>
                Dados principais que aparecerão em documentos e relatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline">Carregar Logo</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG ou JPG, máximo 2MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome da Igreja</Label>
                  <Input defaultValue="Igreja Evangélica Assembleia de Deus" />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" defaultValue="contato@igreja.com" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input defaultValue="(11) 3456-7890" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço</Label>
                  <Input defaultValue="Rua das Flores, 123 - Centro" />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input defaultValue="São Paulo" />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select defaultValue="SP">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gradient-gold text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tributário */}
        <TabsContent value="tributario" className="mt-6 space-y-6">
          <TabelasTributarias />
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como deseja receber alertas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas importantes por e-mail
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas críticos por SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de E-mail</CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de e-mails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Servidor SMTP</Label>
                  <Input placeholder="smtp.exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label>Porta</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>Usuário</Label>
                  <Input placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <Button variant="outline">Testar Conexão</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Políticas de Senha</CardTitle>
              <CardDescription>
                Configure os requisitos de segurança para senhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mínimo de 8 caracteres</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir senha com no mínimo 8 caracteres
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Caracteres especiais</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir pelo menos um caractere especial
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Expiração de senha</Label>
                  <p className="text-sm text-muted-foreground">
                    Forçar troca de senha a cada 90 dias
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar 2FA para todos os usuários</Label>
                  <p className="text-sm text-muted-foreground">
                    Obrigar autenticação em dois fatores
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LGPD e Privacidade</CardTitle>
              <CardDescription>
                Configurações de conformidade com a Lei Geral de Proteção de Dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Termo de Consentimento</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir termo de consentimento para novos usuários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar todas as ações no sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="aparencia" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema do Sistema</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Modo de Exibição</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor Principal</Label>
                <div className="flex gap-2">
                  {["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="sistema" className="mt-6 space-y-6">
          {/* Security & Backup */}
          <SecurityBackup />

          {/* Certificado Digital */}
          <CertificadoDigital />

          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte o sistema a serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">eSocial</p>
                    <p className="text-sm text-muted-foreground">Envio de eventos trabalhistas</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Versão</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última atualização</span>
                  <span>15/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Licença</span>
                  <span>Ativa até 31/12/2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desenvolvedor - Only visible for developer role */}
        {isDeveloper && (
          <TabsContent value="desenvolvedor" className="mt-6 space-y-6">
            {/* Parâmetros Fiscais - DEV ONLY */}
            <ParametrosFiscais isDeveloper={isDeveloper} />

            {/* CEP Engine - DEV ONLY */}
            <CEPEngine isDeveloper={isDeveloper} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
