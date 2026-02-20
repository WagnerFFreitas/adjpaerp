MANUAL DETALHADO DE COMANDOS USADOS NO PROJETO (React + TypeScript + Node/Express + PostgreSQL)

Objetivo
- Explicar, um a um, os comandos, hooks, APIs de roteamento, padrões de componentes, chamadas HTTP e comandos SQL realmente usados no projeto.
- Incluir: o que faz, quando usar, assinatura/forma de uso e exemplos práticos que você pode reutilizar em outros projetos.

Índice
1. React Hooks e Context
2. React Router (Navegação)
3. Componentes, UI e Padrões
4. Hooks Custom do Projeto
5. Chamadas HTTP (Frontend)
6. Node/Express (Backend)
7. PostgreSQL (SQL e Administração)
8. Checklists de Reuso em Novos Projetos

========================================
1) React Hooks e Context

1.1 useState
- O que faz: gerencia estado local em componentes funcionais.
- Quando usar: flags de UI, campos de formulário, seleções temporárias.
- Assinatura: const [state, setState] = useState<T>(valorInicial)
- Exemplo:
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "" })
  // Atualização
  setIsOpen(prev => !prev)
  setForm(f => ({ ...f, name: "Maria" }))

1.2 useEffect
- O que faz: executa efeitos colaterais após render (fetch, timers, listeners). Pode limpar no retorno.
- Quando usar: carregar dados ao montar; assinar eventos; sincronizar com localStorage.
- Assinatura: useEffect(() => { /* efeito */; return () => {/* cleanup */} }, [deps])
- Exemplo:
  useEffect(() => {
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [refresh])

1.3 useMemo
- O que faz: memoiza valores derivados caros de calcular para evitar recomputação.
- Quando usar: listas grandes, cálculos de totais, filtros dependentes de props/estado.
- Assinatura: const memo = useMemo(() => compute(deps), [deps])
- Exemplo:
  const total = useMemo(() => items.reduce((s, i) => s + i.valor, 0), [items])

1.4 useCallback
- O que faz: memoiza funções para manter identidade estável entre renders.
- Quando usar: passar callbacks para filhos memorizados/puros; handlers em listas.
- Assinatura: const fn = useCallback((args) => { ... }, [deps])
- Exemplo:
  const onSave = useCallback(async () => { await api.save(form) }, [form])

1.5 useRef
- O que faz: guarda um valor mutável que não dispara re-render; também referencia elementos DOM.
- Quando usar: foco em inputs; armazenar timers; manter valor anterior.
- Assinatura: const ref = useRef<T>(valorInicial)
- Exemplo:
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

1.6 createContext / useContext
- O que faz: cria e consome contexto para compartilhar estado/serviços sem prop drilling.
- Quando usar: autenticação, configurações, tema, dados usados por muitas telas.
- Assinatura:
  const Ctx = createContext<T | undefined>(undefined)
  const value = useMemo(() => ({ ... }), [...])
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
  const c = useContext(Ctx)
- Exemplo (padrão seguro):
  const AuthContext = createContext<AuthCtx | undefined>(undefined)
  export function useAuth() {
    const c = useContext(AuthContext)
    if (!c) throw new Error('useAuth deve ser usado dentro de AuthProvider')
    return c
  }

1.7 forwardRef
- O que faz: permite que um componente repasse a ref ao elemento interno.
- Quando usar: componentes UI reutilizáveis (Input, Button, Sheet, Tooltip, Tabs etc.).
- Assinatura: const Comp = forwardRef<ElementType, Props>((props, ref) => <el ref={ref} {...props} />)
- Exemplo:
  const Textarea = forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>((props, ref) => (
    <textarea ref={ref} {...props} />
  ))

========================================
2) React Router (Navegação)

2.1 useNavigate
- O que faz: navega programaticamente.
- Quando usar: redirecionar após login/salvar; voltar para tela anterior.
- Assinatura: const navigate = useNavigate()
- Exemplos:
  navigate('/dashboard')
  navigate(-1) // voltar no histórico

2.2 Navigate (componente)
- O que faz: redireciona declarativamente durante a renderização.
- Quando usar: rotas de índice, proteção de rotas.
- Exemplo:
  if (!user) return <Navigate to="/login" replace />

2.3 useParams
- O que faz: lê parâmetros da URL para rotas dinâmicas.
- Quando usar: páginas de detalhes/edição: /recurso/:id
- Exemplo:
  const { id } = useParams<{ id: string }>()

2.4 Link
- O que faz: cria links internos de SPA sem recarregar a página.
- Quando usar: menus, breadcrumbs, navegação em listas.
- Exemplo:
  <Link to="/igreja/membros">Membros</Link>

========================================
3) Componentes, UI e Padrões

3.1 className com Tailwind
- O que faz: aplica utilitários CSS para layout, tipografia e estados.
- Quando usar: composição rápida de UI responsiva.
- Exemplo:
  <div className="flex items-center justify-between p-4 text-sm" />

3.2 Eventos DOM/React
- O que faz: trata interações com onClick, onChange, onSubmit etc.
- Exemplos:
  <form onSubmit={(e) => { e.preventDefault(); onSave() }} />
  <Button onClick={() => setOpen(true)}>Abrir</Button>

3.3 Form state com useState
- Padrão comum:
  const [form, setForm] = useState({ nome: '', email: '' })
  <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />

3.4 Renderização condicional
- O que faz: alterna UI conforme estado/permisoes.
- Exemplos:
  if (loading) return <Spinner />
  return user ? <Dashboard /> : <Navigate to="/login" />

3.5 forwardRef em componentes UI (Radix/shadcn)
- O que faz: mantém ref nativo nos componentes compostos.
- Exemplo resumido:
  const SheetContent = forwardRef<HTMLDivElement, Props>((props, ref) => <div ref={ref} {...props} />)

========================================
4) Hooks Custom do Projeto

4.1 useToast (feedback ao usuário)
- O que faz: exibe toasts de sucesso/erro/infos.
- Quando usar: após ações (login, salvar, excluir).
- Exemplo:
  const { toast } = useToast()
  toast({ title: 'Sucesso', description: 'Operação realizada.' })

4.2 useAuditLog (auditoria)
- O que faz: registra ações do usuário (ex.: CREATE_MEMBER) em backend/Supabase.
- Quando usar: operações sensíveis ou que merecem trilha de auditoria.
- Exemplo:
  const { log } = useAuditLog()
  await log({ action: 'CREATE_MEMBER', metadata: { id: memberId } })

4.3 useIsMobile (layout responsivo)
- O que faz: informa se viewport é mobile (via matchMedia).
- Quando usar: adaptar comportamento/estilos para telas pequenas.
- Exemplo:
  const isMobile = useIsMobile()
  return <div className={isMobile ? 'p-2' : 'p-6'} />

========================================
5) Chamadas HTTP (Frontend)

5.1 Cliente HTTP centralizado (src/lib/api.ts)
- O que faz: concentra chamadas à API; define baseURL, headers e tratamento de erros.
- Quando usar: todas as requisições backend; crie funções por recurso.
- Padrão sugerido:
  type Member = { id: string; name: string }
  async function getMembers(): Promise<Member[]> {
    const res = await fetch(`${BASE_URL}/members`)
    if (!res.ok) throw new Error('Falha ao carregar membros')
    return res.json()
  }
  async function createMember(payload: Member) {
    const res = await fetch(`${BASE_URL}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error('Falha ao criar membro')
    return res.json()
  }

5.2 Tratamento de erros e tipos
- Dica: tipar payloads e respostas; lançar erros para boundary da página.
- Exemplo:
  interface ApiError { message: string }
  async function safe<T>(p: Promise<T>): Promise<[T | null, ApiError | null]> {
    try { return [await p, null] } catch (e: unknown) { return [null, { message: (e as Error).message }] }
  }

========================================
6) Node/Express (Backend)

6.1 express() e middlewares básicos
- O que faz: cria o app, aplica JSON parser, CORS e headers de segurança.
- Exemplo:
  import express from 'express'
  const app = express()
  app.use(express.json())
  // app.use(cors()) // conforme security.ts

6.2 Router por domínio
- O que faz: separa endpoints por área (auth, members, financial, etc.).
- Exemplo:
  import { Router } from 'express'
  const router = Router()
  router.get('/members', membersController.list)
  router.post('/members', membersController.create)
  export default router

6.3 Controllers assíncronos
- O que faz: implementa lógica de cada rota e retorna JSON padronizado.
- Exemplo:
  export const create = async (req, res, next) => {
    try {
      const data = await service.create(req.body)
      res.status(201).json(data)
    } catch (e) { next(e) }
  }

6.4 Middlewares (auth, validator, upload, errorHandler)
- O que faz: intercepta req/res para autenticar, validar, fazer upload e tratar erros.
- Exemplo de erro global:
  app.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status).json({ message: err.message || 'Erro interno' })
  })

6.5 Variáveis de ambiente
- O que faz: parametriza credenciais e configurações (api/.env.example).
- Exemplo: process.env.DATABASE_URL, process.env.JWT_SECRET

6.6 Conexão PostgreSQL (api/config/database.ts)
- O que faz: cria Pool/Client e exporta função query tipada.
- Uso típico no controller: const rows = await db.query('SELECT ... WHERE id = $1', [id])

========================================
7) PostgreSQL (SQL e Administração)

7.1 DDL: CREATE DATABASE / SCHEMA / TABLE
- O que faz: estrutura banco e tabelas.
- Exemplos:
  CREATE DATABASE adjpa WITH ENCODING 'UTF8';
  CREATE SCHEMA app AUTHORIZATION app_owner;
  CREATE TABLE app.members (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

7.2 ALTER TABLE / INDEX
- O que faz: evolui estrutura, adiciona colunas e índices.
- Exemplos:
  ALTER TABLE app.members ADD COLUMN email text;
  CREATE INDEX idx_members_name ON app.members (name);

7.3 DML: INSERT / UPDATE / DELETE / SELECT
- O que faz: manipula e consulta dados.
- Exemplos:
  INSERT INTO app.members (id, name) VALUES (gen_random_uuid(), 'João');
  UPDATE app.members SET name = 'João Silva' WHERE id = $1;
  DELETE FROM app.members WHERE id = $1;
  SELECT id, name FROM app.members WHERE name ILIKE $1 ORDER BY name LIMIT 20 OFFSET 0;

7.4 UPSERT
- O que faz: insere ou atualiza se houver conflito.
- Exemplo:
  INSERT INTO app.members (id, name)
  VALUES ($1, $2)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

7.5 Funções/Triggers (PL/pgSQL)
- O que faz: lógica no banco (auditoria, normalização, timestamps).
- Exemplo trigger de updated_at:
  CREATE OR REPLACE FUNCTION app.set_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
  CREATE TRIGGER trg_set_updated_at
  BEFORE UPDATE ON app.members
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

7.6 Segurança (GRANT/REVOKE/ROLES)
- O que faz: restringe acessos por papéis.
- Exemplos:
  CREATE ROLE app_user LOGIN PASSWORD '...';
  GRANT USAGE ON SCHEMA app TO app_user;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;

7.7 Transações e performance
- O que faz: atomicidade e análise de desempenho.
- Exemplos:
  BEGIN; ... COMMIT; ROLLBACK;
  EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM app.members WHERE name ILIKE '%jo%';

========================================
8) Checklists de Reuso em Novos Projetos

Frontend (React/TS)
- Criar contexts por domínio (Auth, Config) com createContext + useContext + Provider.
- Hooks custom para lógica cross-cutting (useToast, useAuditLog, useIsMobile).
- useState/useEffect/useMemo/useCallback correctamente com dependências.
- Navegação com useNavigate, rotas privadas com componente wrapper (ProtectedRoute).
- Centralizar API em lib/api.ts e tipar entradas/saídas.
- Usar Tailwind e componentes com forwardRef para consistência e acessibilidade.

Backend (Node/Express)
- server.ts com express.json(), CORS e segurança.
- routes/*.ts agrupando endpoints por recurso, controllers/*.ts com try/catch + next.
- middleware para auth, validator, upload e errorHandler.
- config/database.ts com Pool e função query tipada.

PostgreSQL
- Migrations numeradas (01_, 02_, 03_...) para DDL e seeds.
- Schemas por domínio (ex.: app); constraints e índices desde o início.
- Triggers para auditoria/updated_at quando necessário.
- Privilégios mínimos via roles e GRANT específicos.

Observações finais
- Este manual compila os comandos e padrões efetivamente usados no repositório e apresenta exemplos práticos e reutilizáveis. Adapte nomes de módulos, tipos e rotas às necessidades do próximo projeto mantendo as mesmas estruturas de organização e boas práticas aqui descritas.
