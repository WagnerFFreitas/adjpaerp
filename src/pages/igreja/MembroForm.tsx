import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User, Heart, Cross, BookOpen, Gift, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { useToast } from "@/hooks/use-toast";
import { membersApi, ministriesApi, cellsApi } from "@/lib/api";

interface Ministry {
  id: string;
  name: string;
  description?: string;
}

interface Cell {
  id: string;
  name: string;
  description?: string;
}

export default function MembroForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: "",
    birth_date: "",
    cpf: "",
    rg: "",
    gender: "",
    marital_status: "",
    profession: "",
    email: "",
    phone: "",
    whatsapp: "",
    avatar_url: "",
    
    // Vida Espiritual
    conversion_date: "",
    conversion_place: "",
    baptism_date: "",
    baptism_church: "",
    baptism_pastor: "",
    holy_spirit_baptism: "NAO",
    membership_date: "",
    origin_church: "",
    discipleship_course: "",
    bible_school: false,
    status: "ACTIVE",
    
    // Ministérios
    main_ministry: "",
    ministry_function: "",
    other_ministries: [] as string[],
    ecclesiastical_position: "",
    consecration_date: "",
    spiritual_gifts: "",
    talents: "",
    cell_group: "",
    
    // Contribuições
    is_tither: false,
    is_regular_offerer: false,
    participates_campaigns: false,
    
    // Endereço
    address_zip_code: "",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_city: "",
    address_state: "",
    
    // Observações
    observations: "",
    special_needs: "",
  });

  useEffect(() => {
    loadMinistries();
    loadCells();
    if (id) {
      loadMember();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMinistries = async () => {
    try {
      const response = await ministriesApi.list({ is_active: true });
      setMinistries(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar ministérios:", error);
    }
  };

  const loadCells = async () => {
    try {
      const response = await cellsApi.list({ is_active: true });
      setCells(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar células:", error);
    }
  };

  const loadMember = async () => {
    try {
      setIsLoading(true);
      const response = await membersApi.get(id!);
      const member = response.data;
      
      setFormData({
        name: member.name || "",
        birth_date: member.birth_date || "",
        cpf: member.cpf || "",
        rg: member.rg || "",
        gender: member.gender || "",
        marital_status: member.marital_status || "",
        profession: member.profession || "",
        email: member.email || "",
        phone: member.phone || "",
        whatsapp: member.whatsapp || "",
        avatar_url: member.avatar_url || "",
        conversion_date: member.conversion_date || "",
        conversion_place: member.conversion_place || "",
        baptism_date: member.baptism_date || "",
        baptism_church: member.baptism_church || "",
        baptism_pastor: member.baptism_pastor || "",
        holy_spirit_baptism: member.holy_spirit_baptism || "NAO",
        membership_date: member.membership_date || "",
        origin_church: member.origin_church || "",
        discipleship_course: member.discipleship_course || "",
        bible_school: member.bible_school || false,
        status: member.status || "ACTIVE",
        main_ministry: member.main_ministry || "",
        ministry_function: member.ministry_function || "",
        other_ministries: member.other_ministries || [],
        ecclesiastical_position: member.ecclesiastical_position || "",
        consecration_date: member.consecration_date || "",
        spiritual_gifts: member.spiritual_gifts || "",
        talents: member.talents || "",
        cell_group: member.cell_group || "",
        is_tither: member.is_tither || false,
        is_regular_offerer: member.is_regular_offerer || false,
        participates_campaigns: member.participates_campaigns || false,
        address_zip_code: member.address_zip_code || "",
        address_street: member.address_street || "",
        address_number: member.address_number || "",
        address_complement: member.address_complement || "",
        address_neighborhood: member.address_neighborhood || "",
        address_city: member.address_city || "",
        address_state: member.address_state || "",
        observations: member.observations || "",
        special_needs: member.special_needs || "",
      });
    } catch (error) {
      console.error("Erro ao carregar membro:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do membro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get user data from localStorage to get unit_id
      const userStr = localStorage.getItem('adjpa_user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.unit_id) {
        toast({
          title: "Erro",
          description: "Unidade não identificada. Faça login novamente.",
          variant: "destructive",
        });
        return;
      }
      
      const dataToSend = {
        ...formData,
        unit_id: user.unit_id,
      };
      
      if (id) {
        await membersApi.update(id, dataToSend);
        toast({
          title: "Sucesso",
          description: "Membro atualizado com sucesso!",
        });
      } else {
        await membersApi.create(dataToSend);
        toast({
          title: "Sucesso",
          description: "Membro cadastrado com sucesso!",
        });
      }
      navigate("/igreja/membros");
    } catch (error: unknown) {
      console.error("Erro ao salvar membro:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Erro ao salvar membro.";
      toast({
        title: "Erro",
        description: errorMessage || "Erro ao salvar membro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="page-title">{id ? "Editar Membro" : "Novo Membro"}</h1>
          <p className="page-subtitle">{id ? "Atualize os dados do membro" : "Cadastre um novo membro da igreja"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pessoal" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="vidacrista">Vida Espiritual</TabsTrigger>
            <TabsTrigger value="ministerio">Ministérios</TabsTrigger>
            <TabsTrigger value="contribuicoes">Contribuições</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="observacoes">Observações</TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="pessoal" className="space-y-6">
            <div className="card-elevated p-6">
              <div className="flex items-start gap-6 mb-6">
                <PhotoUpload
                  currentPhotoUrl={formData.avatar_url}
                  onPhotoChange={(url) => handleInputChange("avatar_url", url || "")}
                  type="member"
                  id={id || "new"}
                  className="w-32 h-32"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input 
                      id="nome" 
                      placeholder="Nome completo" 
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input 
                      id="dataNascimento" 
                      type="date" 
                      value={formData.birth_date}
                      onChange={(e) => handleInputChange("birth_date", e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input 
                      id="cpf" 
                      placeholder="000.000.000-00" 
                      value={formData.cpf}
                      onChange={(e) => handleInputChange("cpf", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input 
                      id="rg" 
                      placeholder="Número do RG" 
                      value={formData.rg}
                      onChange={(e) => handleInputChange("rg", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Select value={formData.marital_status} onValueChange={(value) => handleInputChange("marital_status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="casado">Casado(a)</SelectItem>
                      <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input 
                    id="profissao" 
                    placeholder="Profissão" 
                    value={formData.profession}
                    onChange={(e) => handleInputChange("profession", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(00) 00000-0000" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">WhatsApp</Label>
                  <Input 
                    id="celular" 
                    placeholder="(00) 00000-0000" 
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Vida Espiritual */}
          <TabsContent value="vidacrista" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Cross className="w-5 h-5 text-secondary" />
                Conversão e Batismo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataConversao">Data de Conversão</Label>
                  <Input 
                    id="dataConversao" 
                    type="date" 
                    value={formData.conversion_date}
                    onChange={(e) => handleInputChange("conversion_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localConversao">Local da Conversão</Label>
                  <Input 
                    id="localConversao" 
                    placeholder="Igreja, campanha, etc." 
                    value={formData.conversion_place}
                    onChange={(e) => handleInputChange("conversion_place", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataBatismoAguas">Data do Batismo nas Águas</Label>
                  <Input 
                    id="dataBatismoAguas" 
                    type="date" 
                    value={formData.baptism_date}
                    onChange={(e) => handleInputChange("baptism_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="igrejaBatismo">Igreja do Batismo</Label>
                  <Input 
                    id="igrejaBatismo" 
                    placeholder="Nome da igreja" 
                    value={formData.baptism_church}
                    onChange={(e) => handleInputChange("baptism_church", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastorBatismo">Pastor que Batizou</Label>
                  <Input 
                    id="pastorBatismo" 
                    placeholder="Nome do pastor" 
                    value={formData.baptism_pastor}
                    onChange={(e) => handleInputChange("baptism_pastor", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batismoEspiritoSanto">Batismo no Espírito Santo</Label>
                  <Select 
                    value={formData.holy_spirit_baptism} 
                    onValueChange={(value) => handleInputChange("holy_spirit_baptism", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIM">Sim</SelectItem>
                      <SelectItem value="NAO">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Formação e Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status do Membro *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataMembresia">Data de Membresia</Label>
                  <Input 
                    id="dataMembresia" 
                    type="date" 
                    value={formData.membership_date}
                    onChange={(e) => handleInputChange("membership_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="igrejaOrigem">Igreja de Origem</Label>
                  <Input 
                    id="igrejaOrigem" 
                    placeholder="Se veio de outra igreja" 
                    value={formData.origin_church}
                    onChange={(e) => handleInputChange("origin_church", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cursoDiscipulado">Curso de Discipulado</Label>
                  <Select 
                    value={formData.discipleship_course} 
                    onValueChange={(value) => handleInputChange("discipleship_course", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                      <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                      <SelectItem value="NAO_INICIADO">Não Iniciado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escolaBiblica">Escola Bíblica</Label>
                  <Select 
                    value={formData.bible_school ? "true" : "false"} 
                    onValueChange={(value) => handleInputChange("bible_school", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Frequenta</SelectItem>
                      <SelectItem value="false">Não frequenta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ministérios */}
          <TabsContent value="ministerio" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Participação nos Ministérios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ministerioPrincipal">Ministério Principal</Label>
                  <Select 
                    value={formData.main_ministry} 
                    onValueChange={(value) => handleInputChange("main_ministry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ministries.map((ministry) => (
                        <SelectItem key={ministry.id} value={ministry.name}>
                          {ministry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoMinisterio">Função no Ministério</Label>
                  <Select 
                    value={formData.ministry_function} 
                    onValueChange={(value) => handleInputChange("ministry_function", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lider">Líder</SelectItem>
                      <SelectItem value="colider">Co-líder</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar</SelectItem>
                      <SelectItem value="membro">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label className="mb-2 block">Outros Ministérios</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ministries.map((ministry) => (
                    <div key={ministry.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`ministry-${ministry.id}`}
                        checked={formData.other_ministries.includes(ministry.name)}
                        onCheckedChange={(checked) => {
                          const newMinistries = checked
                            ? [...formData.other_ministries, ministry.name]
                            : formData.other_ministries.filter(m => m !== ministry.name);
                          handleInputChange("other_ministries", newMinistries);
                        }}
                      />
                      <Label htmlFor={`ministry-${ministry.id}`} className="text-sm">
                        {ministry.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label className="mb-2 block">Célula/Grupo</Label>
                <Select 
                  value={formData.cell_group} 
                  onValueChange={(value) => handleInputChange("cell_group", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma célula" />
                  </SelectTrigger>
                  <SelectContent>
                    {cells.map((cell) => (
                      <SelectItem key={cell.id} value={cell.name}>
                        {cell.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Cross className="w-5 h-5 text-secondary" />
                Cargos Eclesiásticos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoEclesiastico">Cargo Eclesiástico</Label>
                  <Select 
                    value={formData.ecclesiastical_position} 
                    onValueChange={(value) => handleInputChange("ecclesiastical_position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhum">Nenhum</SelectItem>
                      <SelectItem value="obreiro">Obreiro(a)</SelectItem>
                      <SelectItem value="diacono">Diácono(a)</SelectItem>
                      <SelectItem value="presbitero">Presbítero(a)</SelectItem>
                      <SelectItem value="evangelista">Evangelista</SelectItem>
                      <SelectItem value="missionario">Missionário(a)</SelectItem>
                      <SelectItem value="pastor">Pastor(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataConsagracao">Data de Consagração</Label>
                  <Input 
                    id="dataConsagracao" 
                    type="date" 
                    value={formData.consecration_date}
                    onChange={(e) => handleInputChange("consecration_date", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-secondary" />
                Dons Espirituais e Talentos
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spiritual_gifts">Dons Espirituais</Label>
                  <Textarea
                    id="spiritual_gifts"
                    placeholder="Ex: Profecia, Cura, Ensino, Louvor..."
                    rows={2}
                    value={formData.spiritual_gifts}
                    onChange={(e) => handleInputChange("spiritual_gifts", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Separe os dons por vírgula</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="talents">Talentos e Habilidades</Label>
                  <Textarea
                    id="talents"
                    placeholder="Ex: Música, Canto, Teatro, Tecnologia, Liderança..."
                    rows={2}
                    value={formData.talents}
                    onChange={(e) => handleInputChange("talents", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Separe os talentos por vírgula</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contribuições */}
          <TabsContent value="contribuicoes" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Perfil de Contribuição
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dizimista" 
                    checked={formData.is_tither}
                    onCheckedChange={(checked) => handleInputChange("is_tither", checked)}
                  />
                  <Label htmlFor="dizimista">Dizimista</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ofertante" 
                    checked={formData.is_regular_offerer}
                    onCheckedChange={(checked) => handleInputChange("is_regular_offerer", checked)}
                  />
                  <Label htmlFor="ofertante">Ofertante Regular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="campanha" 
                    checked={formData.participates_campaigns}
                    onCheckedChange={(checked) => handleInputChange("participates_campaigns", checked)}
                  />
                  <Label htmlFor="campanha">Participa de Campanhas</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                O histórico detalhado de contribuições pode ser gerenciado na seção Financeiro após salvar o membro.
              </p>
            </div>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="endereco" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Endereço Residencial</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    value={formData.address_zip_code}
                    onChange={(e) => handleInputChange("address_zip_code", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input 
                    id="logradouro" 
                    placeholder="Rua, Avenida, etc." 
                    value={formData.address_street}
                    onChange={(e) => handleInputChange("address_street", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero" 
                    placeholder="Número" 
                    value={formData.address_number}
                    onChange={(e) => handleInputChange("address_number", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input 
                    id="complemento" 
                    placeholder="Apto, Bloco, etc." 
                    value={formData.address_complement}
                    onChange={(e) => handleInputChange("address_complement", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    placeholder="Bairro" 
                    value={formData.address_neighborhood}
                    onChange={(e) => handleInputChange("address_neighborhood", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    placeholder="Cidade" 
                    value={formData.address_city}
                    onChange={(e) => handleInputChange("address_city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.address_state} onValueChange={(value) => handleInputChange("address_state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">Acre</SelectItem>
                      <SelectItem value="AL">Alagoas</SelectItem>
                      <SelectItem value="AP">Amapá</SelectItem>
                      <SelectItem value="AM">Amazonas</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PA">Pará</SelectItem>
                      <SelectItem value="PB">Paraíba</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="RO">Rondônia</SelectItem>
                      <SelectItem value="RR">Roraima</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="SE">Sergipe</SelectItem>
                      <SelectItem value="TO">Tocantins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Observações */}
          <TabsContent value="observacoes" className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Observações e Anotações</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações Gerais</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Informações adicionais sobre o membro..."
                    rows={4}
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="necessidades">Necessidades Especiais</Label>
                  <Textarea
                    id="necessidades"
                    placeholder="Necessidades especiais, restrições, etc."
                    rows={3}
                    value={formData.special_needs}
                    onChange={(e) => handleInputChange("special_needs", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={isLoading}>
              {isLoading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Membro
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
