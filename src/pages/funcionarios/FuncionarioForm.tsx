import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, User, Plus, Trash2, Briefcase, FileText, Building2, Heart, Shield, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhotoUpload } from "@/components/ui/photo-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BancoHorasRegistro {
  id: number;
  data: string;
  tipo: "credito" | "debito";
  horas: string;
  motivo: string;
  status: "pendente" | "aprovado" | "rejeitado";
}

interface Dependente {
  id: number;
  nome: string;
  parentesco: string;
  dataNascimento: string;
  cpf: string;
  irrf: boolean;
  salarioFamilia: boolean;
}

// Mock data for editing
const funcionariosMock: Record<string, any> = {
  "1": { nome: "Maria Silva Santos", cpf: "123.456.789-00", email: "maria@email.com", telefone: "(11) 98765-4321", cargo: "Analista Financeiro", departamento: "financeiro", tipoContrato: "clt", salario: "5500" },
  "2": { nome: "João Pedro Costa", cpf: "987.654.321-00", email: "joao@email.com", telefone: "(11) 91234-5678", cargo: "Desenvolvedor", departamento: "ti", tipoContrato: "clt", salario: "8200" },
  "3": { nome: "Ana Carolina Lima", cpf: "456.789.123-00", email: "ana@email.com", telefone: "(11) 94567-8901", cargo: "Secretária", departamento: "administrativo", tipoContrato: "clt", salario: "3200" },
  "4": { nome: "Carlos Eduardo Souza", cpf: "321.654.987-00", email: "carlos@email.com", telefone: "(11) 97890-1234", cargo: "Contador", departamento: "financeiro", tipoContrato: "pj", salario: "7800" },
  "5": { nome: "Fernanda Oliveira", cpf: "654.321.987-00", email: "fernanda@email.com", telefone: "(11) 92345-6789", cargo: "Estagiária", departamento: "rh", tipoContrato: "estagio", salario: "1800" },
  "6": { nome: "Roberto Almeida", cpf: "789.123.456-00", email: "roberto@email.com", telefone: "(11) 95678-9012", cargo: "Zelador", departamento: "operacional", tipoContrato: "clt", salario: "2100" },
};

const estadosBrasileiros = [
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

const bancosBrasileiros = [
  { codigo: "001", nome: "Banco do Brasil" },
  { codigo: "033", nome: "Santander" },
  { codigo: "104", nome: "Caixa Econômica" },
  { codigo: "237", nome: "Bradesco" },
  { codigo: "341", nome: "Itaú" },
  { codigo: "260", nome: "Nubank" },
  { codigo: "077", nome: "Inter" },
  { codigo: "336", nome: "C6 Bank" },
  { codigo: "212", nome: "Original" },
  { codigo: "655", nome: "Neon" },
  { codigo: "290", nome: "PagBank" },
  { codigo: "380", nome: "PicPay" },
];

const categoriasTrabalhador = [
  { codigo: "101", descricao: "Empregado - Geral, inclusive o empregado público da administração direta ou indireta contratado pela CLT" },
  { codigo: "102", descricao: "Empregado - Trabalhador Rural por Pequeno Prazo da Lei 11.718/2008" },
  { codigo: "103", descricao: "Empregado - Aprendiz" },
  { codigo: "104", descricao: "Empregado - Doméstico" },
  { codigo: "105", descricao: "Empregado - contrato a termo firmado nos termos da Lei 9.601/98" },
  { codigo: "106", descricao: "Empregado - contrato por prazo determinado nos termos da Lei 6.019/74" },
  { codigo: "111", descricao: "Empregado - contrato de trabalho intermitente" },
  { codigo: "301", descricao: "Servidor Público - Titular de Cargo Efetivo" },
  { codigo: "306", descricao: "Servidor Público - Contratado por Tempo Determinado" },
  { codigo: "901", descricao: "Estagiário" },
];

export default function FuncionarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id && funcionariosMock[id]) {
      setFormData(funcionariosMock[id]);
    }
  }, [id]);

  const addDependente = () => {
    setDependentes([
      ...dependentes,
      {
        id: Date.now(),
        nome: "",
        parentesco: "",
        dataNascimento: "",
        cpf: "",
        irrf: false,
        salarioFamilia: false,
      },
    ]);
  };

  const removeDependente = (id: number) => {
    setDependentes(dependentes.filter((d) => d.id !== id));
  };

  const updateDependente = (id: number, field: keyof Dependente, value: any) => {
    setDependentes(
      dependentes.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/funcionarios");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? "Editar Funcionário" : "Novo Funcionário"}</h1>
          <p className="page-subtitle">{isEditing ? "Atualize os dados do colaborador" : "Cadastre um novo colaborador no sistema"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pessoal" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="pessoal" className="gap-2">
              <User className="w-4 h-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="trabalhista" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Contrato
            </TabsTrigger>
            <TabsTrigger value="jornada" className="gap-2">
              <Clock className="w-4 h-4" />
              Jornada
            </TabsTrigger>
            <TabsTrigger value="banco-horas" className="gap-2">
              <Calendar className="w-4 h-4" />
              Banco de Horas
            </TabsTrigger>
            <TabsTrigger value="documentos" className="gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="endereco" className="gap-2">
              <Building2 className="w-4 h-4" />
              Endereço
            </TabsTrigger>
            <TabsTrigger value="bancario" className="gap-2">
              <Building2 className="w-4 h-4" />
              Dados Bancários
            </TabsTrigger>
            <TabsTrigger value="beneficios" className="gap-2">
              <Heart className="w-4 h-4" />
              Benefícios
            </TabsTrigger>
            <TabsTrigger value="esocial" className="gap-2">
              <Shield className="w-4 h-4" />
              eSocial
            </TabsTrigger>
            <TabsTrigger value="dependentes" className="gap-2">
              <User className="w-4 h-4" />
              Dependentes
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="pessoal" className="space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-start gap-6 mb-6">
                <PhotoUpload
                  currentPhotoUrl={photoUrl}
                  onPhotoChange={setPhotoUrl}
                  type="employee"
                  id={id || 'new'}
                  className="w-32 h-32"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" placeholder="Nome completo do funcionário" required defaultValue={formData.nome || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeSocial">Nome Social</Label>
                    <Input id="nomeSocial" placeholder="Nome social (opcional)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" required defaultValue={formData.cpf || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" placeholder="Número do RG" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input id="dataNascimento" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="O">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      <SelectItem value="uniao">União Estável</SelectItem>
                      <SelectItem value="separado">Separado(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                  <Select defaultValue="brasileiro">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brasileiro">Brasileiro(a)</SelectItem>
                      <SelectItem value="naturalizado">Naturalizado(a)</SelectItem>
                      <SelectItem value="estrangeiro">Estrangeiro(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naturalidade">Naturalidade (Cidade/UF)</Label>
                  <Input id="naturalidade" placeholder="Ex: São Paulo/SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escolaridade">Escolaridade *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
                      <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
                      <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
                      <SelectItem value="medio_completo">Médio Completo</SelectItem>
                      <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
                      <SelectItem value="superior_completo">Superior Completo</SelectItem>
                      <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
                      <SelectItem value="mestrado">Mestrado</SelectItem>
                      <SelectItem value="doutorado">Doutorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raca">Raça/Cor (eSocial)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Branca</SelectItem>
                      <SelectItem value="2">Preta</SelectItem>
                      <SelectItem value="3">Parda</SelectItem>
                      <SelectItem value="4">Amarela</SelectItem>
                      <SelectItem value="5">Indígena</SelectItem>
                      <SelectItem value="6">Não Informado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeMae">Nome da Mãe *</Label>
                  <Input id="nomeMae" placeholder="Nome completo da mãe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomePai">Nome do Pai</Label>
                  <Input id="nomePai" placeholder="Nome completo do pai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input id="telefone" placeholder="(00) 00000-0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input id="celular" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contatoEmergencia">Contato de Emergência</Label>
                  <Input id="contatoEmergencia" placeholder="Nome - Telefone" />
                </div>
              </div>

              {/* PCD e Deficiência */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">Pessoa com Deficiência (PCD)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pcd" />
                    <Label htmlFor="pcd" className="cursor-pointer">Possui deficiência</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoDeficiencia">Tipo de Deficiência</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione se aplicável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="auditiva">Auditiva</SelectItem>
                        <SelectItem value="visual">Visual</SelectItem>
                        <SelectItem value="mental">Mental/Intelectual</SelectItem>
                        <SelectItem value="multipla">Múltipla</SelectItem>
                        <SelectItem value="reabilitado">Reabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacaoPcd">Observações sobre deficiência</Label>
                    <Input id="observacaoPcd" placeholder="Detalhes adicionais" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dados Trabalhistas */}
          <TabsContent value="trabalhista" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Informações do Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input id="matricula" placeholder="Gerada automaticamente" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoContrato">Tipo de Contrato *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT - Prazo Indeterminado</SelectItem>
                      <SelectItem value="clt_determinado">CLT - Prazo Determinado</SelectItem>
                      <SelectItem value="clt_experiencia">CLT - Experiência</SelectItem>
                      <SelectItem value="clt_intermitente">CLT - Intermitente</SelectItem>
                      <SelectItem value="pj">PJ - Pessoa Jurídica</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="aprendiz">Jovem Aprendiz</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                      <SelectItem value="domestico">Doméstico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                  <Input id="dataAdmissao" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataTermino">Data Término Contrato</Label>
                  <Input id="dataTermino" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataExameAdmissional">Exame Admissional *</Label>
                  <Input id="dataExameAdmissional" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input id="cargo" placeholder="Cargo do funcionário" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input id="funcao" placeholder="Função desempenhada" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cbo">Código CBO *</Label>
                  <Input id="cbo" placeholder="Ex: 2521-05" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="administrativo">Administrativo</SelectItem>
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="producao">Produção</SelectItem>
                      <SelectItem value="logistica">Logística</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centroCusto">Centro de Custo</Label>
                  <Input id="centroCusto" placeholder="Centro de custo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localTrabalho">Local de Trabalho</Label>
                  <Input id="localTrabalho" placeholder="Filial/Unidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sindicato">Sindicato</Label>
                  <Input id="sindicato" placeholder="Nome do sindicato" />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Remuneração</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salario">Salário Base *</Label>
                  <Input id="salario" placeholder="R$ 0,00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoSalario">Tipo de Salário *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="hora">Por Hora</SelectItem>
                      <SelectItem value="dia">Diário</SelectItem>
                      <SelectItem value="semana">Semanal</SelectItem>
                      <SelectItem value="quinzena">Quinzenal</SelectItem>
                      <SelectItem value="tarefa">Por Tarefa/Comissão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diaPagamento">Dia do Pagamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Dia 5</SelectItem>
                      <SelectItem value="10">Dia 10</SelectItem>
                      <SelectItem value="15">Dia 15</SelectItem>
                      <SelectItem value="20">Dia 20</SelectItem>
                      <SelectItem value="25">Dia 25</SelectItem>
                      <SelectItem value="30">Último dia útil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Jornada de Trabalho</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jornada">Carga Horária Semanal *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20 horas</SelectItem>
                      <SelectItem value="30">30 horas</SelectItem>
                      <SelectItem value="36">36 horas</SelectItem>
                      <SelectItem value="40">40 horas</SelectItem>
                      <SelectItem value="44">44 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escala">Escala de Trabalho</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5x2">5x2 (Seg-Sex)</SelectItem>
                      <SelectItem value="6x1">6x1</SelectItem>
                      <SelectItem value="12x36">12x36</SelectItem>
                      <SelectItem value="4x3">4x3</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioEntrada">Horário de Entrada</Label>
                  <Input id="horarioEntrada" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioSaida">Horário de Saída</Label>
                  <Input id="horarioSaida" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervaloInicio">Início Intervalo</Label>
                  <Input id="intervaloInicio" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervaloFim">Fim Intervalo</Label>
                  <Input id="intervaloFim" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervalo">Duração Intervalo (min)</Label>
                  <Input id="intervalo" placeholder="60" type="number" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="bancoHoras" />
                  <Label htmlFor="bancoHoras" className="cursor-pointer">Utiliza Banco de Horas</Label>
                </div>
              </div>
            </div>

            {/* Adicionais */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Adicionais e Condições Especiais</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="insalubridade" />
                  <Label htmlFor="insalubridade" className="cursor-pointer">Insalubridade</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grauInsalubridade">Grau Insalubridade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Se aplicável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Mínimo (10%)</SelectItem>
                      <SelectItem value="20">Médio (20%)</SelectItem>
                      <SelectItem value="40">Máximo (40%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="periculosidade" />
                  <Label htmlFor="periculosidade" className="cursor-pointer">Periculosidade (30%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="adicionalNoturno" />
                  <Label htmlFor="adicionalNoturno" className="cursor-pointer">Adicional Noturno</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="primeiroEmprego" />
                  <Label htmlFor="primeiroEmprego" className="cursor-pointer">Primeiro Emprego</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="optanteFGTS" defaultChecked />
                  <Label htmlFor="optanteFGTS" className="cursor-pointer">Optante FGTS</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Jornada de Trabalho - Nova Aba Separada */}
          <TabsContent value="jornada" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Configuração de Jornada</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jornadaCarga">Carga Horária Semanal *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20 horas</SelectItem>
                      <SelectItem value="30">30 horas</SelectItem>
                      <SelectItem value="36">36 horas</SelectItem>
                      <SelectItem value="40">40 horas</SelectItem>
                      <SelectItem value="44">44 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jornadaEscala">Escala de Trabalho</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5x2">5x2 (Seg-Sex)</SelectItem>
                      <SelectItem value="6x1">6x1</SelectItem>
                      <SelectItem value="12x36">12x36</SelectItem>
                      <SelectItem value="4x3">4x3</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jornadaTipo">Tipo de Jornada</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="externo">Trabalho Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jornadaModalidade">Modalidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diurno">Diurno</SelectItem>
                      <SelectItem value="noturno">Noturno</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Horários</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Segunda a Sexta</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entrada</Label>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Saída</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Início Intervalo</Label>
                      <Input type="time" defaultValue="12:00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fim Intervalo</Label>
                      <Input type="time" defaultValue="13:00" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Sábado (se aplicável)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entrada</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>Saída</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="trabalhaFeriados" />
                    <Label htmlFor="trabalhaFeriados" className="cursor-pointer">Trabalha em feriados</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Controle de Ponto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Registro de Ponto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eletronico">Ponto Eletrônico</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="biometrico">Biométrico</SelectItem>
                      <SelectItem value="app">Aplicativo Mobile</SelectItem>
                      <SelectItem value="isento">Isento (Art. 62 CLT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tolerância (minutos)</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Código do Horário</Label>
                  <Input placeholder="Ex: H001" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="utilizaBancoHoras" />
                  <Label htmlFor="utilizaBancoHoras" className="cursor-pointer">Utiliza Banco de Horas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="controlaIntervalo" />
                  <Label htmlFor="controlaIntervalo" className="cursor-pointer">Controla Intervalo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="horasExtrasAutorizadas" />
                  <Label htmlFor="horasExtrasAutorizadas" className="cursor-pointer">Horas Extras Autorizadas</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Banco de Horas - Nova Aba */}
          <TabsContent value="banco-horas" className="space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Resumo do Banco de Horas</h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Lançar Horas
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm text-muted-foreground">Crédito Total</p>
                  <p className="text-2xl font-bold text-success">+24:30</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Débito Total</p>
                  <p className="text-2xl font-bold text-destructive">-08:15</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-bold text-primary">+16:15</p>
                </div>
                <div className="p-4 rounded-lg bg-muted border">
                  <p className="text-sm text-muted-foreground">Período de Apuração</p>
                  <p className="text-lg font-semibold">Jan 2026</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Configurações do Banco de Horas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data Início do Acordo</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim do Acordo</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Limite de Saldo (horas)</Label>
                  <Input type="number" placeholder="120" />
                </div>
                <div className="space-y-2">
                  <Label>Período de Compensação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses (anual)</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Multiplicador HE Diurna</Label>
                  <Input type="number" step="0.01" placeholder="1.50" />
                </div>
                <div className="space-y-2">
                  <Label>Multiplicador HE Noturna</Label>
                  <Input type="number" step="0.01" placeholder="2.00" />
                </div>
              </div>
            </div>

            <div className="card-elevated overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">Histórico de Lançamentos</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>20/01/2026</TableCell>
                    <TableCell><span className="text-success font-medium">Crédito</span></TableCell>
                    <TableCell>+02:00</TableCell>
                    <TableCell>Hora extra - Fechamento mensal</TableCell>
                    <TableCell><span className="px-2 py-1 rounded text-xs bg-success/10 text-success">Aprovado</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>18/01/2026</TableCell>
                    <TableCell><span className="text-destructive font-medium">Débito</span></TableCell>
                    <TableCell>-01:30</TableCell>
                    <TableCell>Compensação - Consulta médica</TableCell>
                    <TableCell><span className="px-2 py-1 rounded text-xs bg-success/10 text-success">Aprovado</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2026</TableCell>
                    <TableCell><span className="text-success font-medium">Crédito</span></TableCell>
                    <TableCell>+03:30</TableCell>
                    <TableCell>Hora extra - Projeto especial</TableCell>
                    <TableCell><span className="px-2 py-1 rounded text-xs bg-warning/10 text-warning">Pendente</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Documentos Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctps">CTPS (Número) *</Label>
                  <Input id="ctps" placeholder="Número da CTPS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctpsSerie">CTPS (Série) *</Label>
                  <Input id="ctpsSerie" placeholder="Série da CTPS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctpsUF">CTPS (UF)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map((estado) => (
                        <SelectItem key={estado.sigla} value={estado.sigla}>{estado.sigla}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctpsDataEmissao">CTPS Data Emissão</Label>
                  <Input id="ctpsDataEmissao" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pis">PIS/PASEP *</Label>
                  <Input id="pis" placeholder="Número do PIS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pisDataCadastro">PIS Data Cadastro</Label>
                  <Input id="pisDataCadastro" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgOrgaoEmissor">RG Órgão Emissor</Label>
                  <Input id="rgOrgaoEmissor" placeholder="Ex: SSP/SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rgDataEmissao">RG Data Emissão</Label>
                  <Input id="rgDataEmissao" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tituloEleitor">Título de Eleitor</Label>
                  <Input id="tituloEleitor" placeholder="Número do título" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tituloZona">Zona Eleitoral</Label>
                  <Input id="tituloZona" placeholder="Zona" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tituloSecao">Seção Eleitoral</Label>
                  <Input id="tituloSecao" placeholder="Seção" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservista">Certificado de Reservista</Label>
                  <Input id="reservista" placeholder="Número do certificado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservistaCategoria">Categoria Reservista</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1ª Categoria</SelectItem>
                      <SelectItem value="2">2ª Categoria</SelectItem>
                      <SelectItem value="3">3ª Categoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnh">CNH Número</Label>
                  <Input id="cnh" placeholder="Número da CNH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnhCategoria">CNH Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnhValidade">CNH Validade</Label>
                  <Input id="cnhValidade" type="date" />
                </div>
              </div>

              <div className="mt-6">
                <Label>Upload de Documentos</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG até 10MB
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="endereco" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Endereço Residencial</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input id="cep" placeholder="00000-000" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input id="logradouro" placeholder="Rua, Avenida, etc." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" placeholder="Número" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" placeholder="Apto, Bloco, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" placeholder="Bairro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" placeholder="Cidade" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map((estado) => (
                        <SelectItem key={estado.sigla} value={estado.sigla}>{estado.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input id="pais" placeholder="Brasil" defaultValue="Brasil" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dados Bancários */}
          <TabsContent value="bancario" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Dados Bancários para Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancosBrasileiros.map((banco) => (
                        <SelectItem key={banco.codigo} value={banco.codigo}>
                          {banco.codigo} - {banco.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencia">Agência *</Label>
                  <Input id="agencia" placeholder="0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agenciaDV">Dígito Agência</Label>
                  <Input id="agenciaDV" placeholder="0" maxLength={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conta">Conta *</Label>
                  <Input id="conta" placeholder="00000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contaDV">Dígito Conta *</Label>
                  <Input id="contaDV" placeholder="0" maxLength={1} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoConta">Tipo de Conta *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                      <SelectItem value="salario">Conta Salário</SelectItem>
                      <SelectItem value="pagamento">Conta de Pagamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Input id="pix" placeholder="CPF, E-mail, Telefone ou Aleatória" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoPix">Tipo Chave PIX</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Benefícios */}
          <TabsContent value="beneficios" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Vale-Transporte</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="optanteVT" defaultChecked />
                  <Label htmlFor="optanteVT" className="cursor-pointer">Optante pelo Vale-Transporte</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorVT">Valor Diário VT</Label>
                  <Input id="valorVT" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidadeVT">Quantidade de Vales/Dia</Label>
                  <Input id="quantidadeVT" placeholder="Ex: 2" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linhasVT">Linhas/Trajeto</Label>
                  <Input id="linhasVT" placeholder="Ex: Metro L1 + Ônibus 123" />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Vale-Alimentação / Vale-Refeição</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="optanteVA" />
                  <Label htmlFor="optanteVA" className="cursor-pointer">Vale-Alimentação (VA)</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorVA">Valor Mensal VA</Label>
                  <Input id="valorVA" placeholder="R$ 0,00" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="optanteVR" />
                  <Label htmlFor="optanteVR" className="cursor-pointer">Vale-Refeição (VR)</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorVR">Valor Diário VR</Label>
                  <Input id="valorVR" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operadoraVAVR">Operadora VA/VR</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alelo">Alelo</SelectItem>
                      <SelectItem value="sodexo">Sodexo</SelectItem>
                      <SelectItem value="ticket">Ticket</SelectItem>
                      <SelectItem value="vr">VR Benefícios</SelectItem>
                      <SelectItem value="flash">Flash</SelectItem>
                      <SelectItem value="caju">Caju</SelectItem>
                      <SelectItem value="ifood">iFood Benefícios</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descontoVAVR">% Desconto Funcionário</Label>
                  <Input id="descontoVAVR" placeholder="Ex: 20" type="number" />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Plano de Saúde</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="planoSaude" />
                  <Label htmlFor="planoSaude" className="cursor-pointer">Possui Plano de Saúde</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operadoraSaude">Operadora</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amil">Amil</SelectItem>
                      <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      <SelectItem value="sulamerica">SulAmérica</SelectItem>
                      <SelectItem value="unimed">Unimed</SelectItem>
                      <SelectItem value="notredame">NotreDame Intermédica</SelectItem>
                      <SelectItem value="hapvida">Hapvida</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planoTipo">Tipo de Plano</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enfermaria">Enfermaria</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="executivo">Executivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorPlanoSaude">Valor Mensal</Label>
                  <Input id="valorPlanoSaude" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descontoPlanoSaude">% Desconto Funcionário</Label>
                  <Input id="descontoPlanoSaude" placeholder="Ex: 30" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carteirinhaSaude">Nº Carteirinha</Label>
                  <Input id="carteirinhaSaude" placeholder="Número da carteirinha" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="incluiDependentesSaude" />
                  <Label htmlFor="incluiDependentesSaude" className="cursor-pointer">Inclui Dependentes</Label>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Plano Odontológico</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="planoOdonto" />
                  <Label htmlFor="planoOdonto" className="cursor-pointer">Possui Plano Odontológico</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operadoraOdonto">Operadora</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amil">Amil Dental</SelectItem>
                      <SelectItem value="bradesco">Bradesco Dental</SelectItem>
                      <SelectItem value="sulamerica">SulAmérica Odonto</SelectItem>
                      <SelectItem value="metlife">MetLife</SelectItem>
                      <SelectItem value="odontoprev">OdontoPrev</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorPlanoOdonto">Valor Mensal</Label>
                  <Input id="valorPlanoOdonto" placeholder="R$ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descontoPlanoOdonto">% Desconto Funcionário</Label>
                  <Input id="descontoPlanoOdonto" placeholder="Ex: 50" type="number" />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Outros Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="seguroVida" />
                  <Label htmlFor="seguroVida" className="cursor-pointer">Seguro de Vida</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorSeguroVida">Valor Cobertura</Label>
                  <Input id="valorSeguroVida" placeholder="R$ 0,00" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auxCreche" />
                  <Label htmlFor="auxCreche" className="cursor-pointer">Auxílio Creche</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorAuxCreche">Valor Auxílio Creche</Label>
                  <Input id="valorAuxCreche" placeholder="R$ 0,00" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auxEducacao" />
                  <Label htmlFor="auxEducacao" className="cursor-pointer">Auxílio Educação</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorAuxEducacao">Valor Auxílio Educação</Label>
                  <Input id="valorAuxEducacao" placeholder="R$ 0,00" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gympass" />
                  <Label htmlFor="gympass" className="cursor-pointer">Gympass/Wellhub</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planoGympass">Plano Gympass</Label>
                  <Input id="planoGympass" placeholder="Ex: Gold" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* eSocial */}
          <TabsContent value="esocial" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Dados para eSocial</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Informações obrigatórias para envio ao eSocial conforme layout atual.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoriaESocial">Categoria do Trabalhador *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasTrabalhador.map((cat) => (
                        <SelectItem key={cat.codigo} value={cat.codigo}>
                          {cat.codigo} - {cat.descricao.substring(0, 50)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matriculaESocial">Matrícula eSocial</Label>
                  <Input id="matriculaESocial" placeholder="Matrícula no eSocial" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naturezaAtividade">Natureza da Atividade *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Trabalho Urbano</SelectItem>
                      <SelectItem value="2">Trabalho Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoRegimePrevidenciario">Tipo Regime Previdenciário *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">RGPS - Regime Geral de Previdência Social</SelectItem>
                      <SelectItem value="2">RPPS - Regime Próprio de Previdência Social</SelectItem>
                      <SelectItem value="3">RPPE - Regime de Previdência Social no Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoRegimeTrabalhista">Tipo Regime Trabalhista *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">CLT - Consolidação das Leis do Trabalho</SelectItem>
                      <SelectItem value="2">Estatutário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="indicativoAdmissao">Indicativo de Admissão</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Normal</SelectItem>
                      <SelectItem value="2">Decorrente de Ação Fiscal</SelectItem>
                      <SelectItem value="3">Decorrente de Decisão Judicial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Informações Adicionais eSocial</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoJornada">Tipo de Jornada eSocial *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Submetido a Horário de Trabalho (Cláusula Expressa)</SelectItem>
                      <SelectItem value="2">Atividade Externa (Art. 62, I CLT)</SelectItem>
                      <SelectItem value="3">Funções Excluídas (Art. 62, II CLT)</SelectItem>
                      <SelectItem value="9">Não Existe Previsão de Controle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricaoJornada">Descrição da Jornada</Label>
                  <Input id="descricaoJornada" placeholder="Ex: Segunda a Sexta das 08:00 às 17:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempoParcial">Contrato Tempo Parcial</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Não é Contrato em Tempo Parcial</SelectItem>
                      <SelectItem value="1">Limitado a 25h Semanais</SelectItem>
                      <SelectItem value="2">Limitado a 30h Semanais</SelectItem>
                      <SelectItem value="3">Limitado a 26h Semanais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="teletrabalho" />
                  <Label htmlFor="teletrabalho" className="cursor-pointer">Teletrabalho/Home Office</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="clausulaAsseguratoria" />
                  <Label htmlFor="clausulaAsseguratoria" className="cursor-pointer">Cláusula Asseguratória (Contrato Determinado)</Label>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Sucessão Trabalhista / Transferência</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoAdmissao">Tipo de Admissão</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admissão</SelectItem>
                      <SelectItem value="2">Transferência de Empresa do Mesmo Grupo</SelectItem>
                      <SelectItem value="3">Transferência de Empresa Consorciada</SelectItem>
                      <SelectItem value="4">Transferência por Motivo de Sucessão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpjEmpresaAnterior">CNPJ Empresa Anterior</Label>
                  <Input id="cnpjEmpresaAnterior" placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matriculaAnterior">Matrícula Anterior</Label>
                  <Input id="matriculaAnterior" placeholder="Matrícula na empresa anterior" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataAdmissaoAnterior">Data Admissão Origem</Label>
                  <Input id="dataAdmissaoAnterior" type="date" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dependentes */}
          <TabsContent value="dependentes" className="space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Dependentes</h3>
                  <p className="text-sm text-muted-foreground">Cadastre dependentes para IRRF, Salário Família e Plano de Saúde</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addDependente}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Dependente
                </Button>
              </div>

              {dependentes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dependente cadastrado</p>
                  <p className="text-sm">Clique em "Adicionar Dependente" para incluir</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dependentes.map((dep, index) => (
                    <div key={dep.id} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-sm">Dependente {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeDependente(dep.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Nome Completo *</Label>
                          <Input
                            placeholder="Nome do dependente"
                            value={dep.nome}
                            onChange={(e) => updateDependente(dep.id, "nome", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Parentesco *</Label>
                          <Select
                            value={dep.parentesco}
                            onValueChange={(value) => updateDependente(dep.id, "parentesco", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conjuge">Cônjuge</SelectItem>
                              <SelectItem value="companheiro">Companheiro(a)</SelectItem>
                              <SelectItem value="filho">Filho(a)</SelectItem>
                              <SelectItem value="enteado">Enteado(a)</SelectItem>
                              <SelectItem value="pai">Pai</SelectItem>
                              <SelectItem value="mae">Mãe</SelectItem>
                              <SelectItem value="avo">Avô/Avó</SelectItem>
                              <SelectItem value="neto">Neto(a)</SelectItem>
                              <SelectItem value="irmao">Irmão(ã)</SelectItem>
                              <SelectItem value="menor_guarda">Menor sob Guarda</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Data de Nascimento *</Label>
                          <Input
                            type="date"
                            value={dep.dataNascimento}
                            onChange={(e) => updateDependente(dep.id, "dataNascimento", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CPF</Label>
                          <Input
                            placeholder="000.000.000-00"
                            value={dep.cpf}
                            onChange={(e) => updateDependente(dep.id, "cpf", e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-6 pt-6 md:col-span-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dep.irrf}
                              onChange={(e) => updateDependente(dep.id, "irrf", e.target.checked)}
                              className="w-4 h-4 rounded border-input"
                            />
                            <span className="text-sm">Deduz IRRF</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dep.salarioFamilia}
                              onChange={(e) => updateDependente(dep.id, "salarioFamilia", e.target.checked)}
                              className="w-4 h-4 rounded border-input"
                            />
                            <span className="text-sm">Salário Família</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-input"
                            />
                            <span className="text-sm">Inclui Plano de Saúde</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-input"
                            />
                            <span className="text-sm">Inclui Plano Odontológico</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" variant="gradient" disabled={isLoading}>
            <Save className="w-4 h-4" />
            {isLoading ? "Salvando..." : "Salvar Funcionário"}
          </Button>
        </div>
      </form>
    </div>
  );
}
