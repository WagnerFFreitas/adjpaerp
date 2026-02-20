# 📘 Guia de Referência Técnica - ADJPA ERP

Este documento é um compêndio detalhado de todos os comandos, expressões, classes de estilo e recursos utilizados no desenvolvimento do sistema, refletindo fielmente o código fonte atual.

---

## 🎨 1. Tailwind CSS (Estilização Completa)

O projeto utiliza extensivamente o **Tailwind CSS**. Abaixo estão as classes e expressões específicas encontradas nos arquivos (ex: `CrachaModal.tsx`, `CrachaCard.tsx`).

### 📐 Layout e Flexbox
Comandos para estruturar a página:
- **`flex`**: Define um container flexível.
- **`flex-col`**: Organiza os itens em coluna (vertical).
- **`flex-1`**: Faz o item crescer para ocupar o espaço sobrando.
- **`flex-shrink-0`**: Impede o item de encolher (útil para cabeçalhos/rodapés fixos em modais).
- **`grid`**: Define um grid.
- **`grid-cols-1 lg:grid-cols-2`**: 1 coluna em telas pequenas, 2 colunas em telas grandes (`lg`).
- **`items-center`**: Alinha itens verticalmente ao centro.
- **`justify-between`**: Distribui itens com espaço igual entre eles.
- **`hidden`**: Oculta o elemento (`display: none`).
- **`block`**: Exibe como bloco.

### 📏 Dimensões e Tamanhos (Com Valores Arbitrários)
O projeto usa a sintaxe `[]` para valores exatos que não estão na escala padrão do Tailwind:
- **`max-w-4xl`**: Largura máxima do container (aprox. 896px).
- **`max-h-[90vh]`**: Altura máxima de 90% da altura da janela (Viewport Height).
- **`h-[300px]`**: Altura fixa de 300 pixels (usado na lista de seleção).
- **`h-[350px]`**: Altura fixa de 350 pixels (usado no preview).
- **`min-h-0`**: Permite que um flex-child encolha abaixo do seu conteúdo mínimo (crucial para scroll dentro de flex).
- **`w-4 h-4`**: Largura e altura de 1rem (ícones pequenos).
- **`w-full`**: Largura 100%.
- **`scale-75`**: Reduz o elemento para 75% do tamanho original (zoom out).
- **`origin-top-left`**: Define o ponto de origem da transformação de escala.

### 🔠 Tipografia
- **`text-sm`**: Fonte pequena.
- **`text-[8px]`**: Fonte exata de 8px (ex: placeholder de logo).
- **`text-[6px]`**: Fonte exata de 6px (ex: rodapé do crachá).
- **`font-medium`**: Peso da fonte médio (500).
- **`font-bold`**: Peso da fonte negrito (700).
- **`text-muted-foreground`**: Cor de texto cinza suave (padrão do tema Shadcn).
- **`truncate`**: Corta o texto com "..." se não couber na linha.
- **`text-center`**: Centraliza o texto.

### 🎨 Cores, Bordas e Efeitos
- **`bg-primary/10`**: Fundo com a cor primária e 10% de opacidade.
- **`bg-muted/30`**: Fundo cinza claro com 30% de opacidade.
- **`hover:bg-muted`**: Muda a cor de fundo ao passar o mouse.
- **`border`**: Borda padrão (1px).
- **`border-t`**: Borda apenas no topo.
- **`rounded-lg`**: Cantos arredondados grandes (0.5rem).
- **`shadow-md`**: Sombra média.
- **`cursor-pointer`**: Muda o cursor para "mãozinha".

---

## ⚛️ 2. React & Hooks (Frontend)

### Hooks e Funções Específicas
- **`useState`**: Gerencia estado local (ex: `const [showPreview, setShowPreview] = useState(false)`).
- **`useRef`**: Cria referência para elementos DOM (ex: `const printRef = useRef<HTMLDivElement>(null)` para impressão).
- **`forwardRef`**: Permite que um componente pai acesse a `ref` de um filho (usado em `CrachaPrintSheet` para o `react-to-print` funcionar).
- **`useReactToPrint`**: Hook da biblioteca externa para gerenciar a janela de impressão.
  ```tsx
  const handlePrint = useReactToPrint({ contentRef: printRef, ... });
  ```

### Componentes UI (Shadcn/Radix)
Componentes reutilizáveis importados de `@/components/ui`:
- **`Dialog`**: Sistema de modal completo (`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `DialogDescription`).
- **`ScrollArea`**: Container com barra de rolagem customizada e estilizada.
- **`Avatar`**: Componente para exibir fotos de usuário ou iniciais (`AvatarImage`, `AvatarFallback`).
- **`Button`**: Botão padronizado com variantes (`variant="outline"`, `variant="ghost"`, `variant="gradient"`).
- **`Checkbox`**: Caixa de seleção estilizada.
- **`Input`**, **`Label`**: Campos de formulário e etiquetas.

### Bibliotecas Externas
- **`lucide-react`**: Ícones (`Printer`, `FileDown`, `Check`).
- **`qrcode.react`**: Componente `QRCodeSVG` para gerar QR Codes.
- **`react-to-print`**: Lógica de impressão.

---

## 🌐 3. Lógica e Estruturas (TypeScript)

### Renderização Condicional
- **Operador Ternário (`? :`)**:
  ```tsx
  {showPreview ? "Esconder prévia" : "Mostrar prévia"}
  ```

- **Listas (Loop/Map):**
  ```tsx
  {/* Para cada usuário, cria um item de lista */}
  {usuarios.map((usuario) => (
    <li key={usuario.id}>{usuario.nome}</li>
  ))}
  ```

---

## 🎨 3. CSS (Tailwind)

O projeto usa classes utilitárias do **Tailwind CSS** diretamente no atributo `className`.

### Classes Mais Usadas

| Categoria | Classes Comuns | Descrição |
|-----------|----------------|-----------|
| **Layout** | `flex`, `grid`, `hidden`, `block` | Define o comportamento do container |
| **Espaçamento** | `p-4`, `m-2`, `gap-4`, `space-y-2` | Padding, Margin, Espaço entre itens |
| **Tamanho** | `w-full`, `h-screen`, `max-w-md` | Largura total, Altura da tela, Largura máx |
| **Tipografia** | `text-xl`, `font-bold`, `text-center` | Tamanho, Peso, Alinhamento |
| **Cores** | `bg-white`, `text-gray-900`, `border-red-500` | Fundo, Texto, Borda |
| **Interação** | `hover:bg-blue-700`, `cursor-pointer` | Estilo ao passar o mouse |

### Exemplo Prático
```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800">Título do Card</h2>
</div>
```

---

## 🐘 4. PostgreSQL (Banco de Dados)

Comandos SQL utilizados nas migrations e manutenções do banco.

### DDL (Definição de Estrutura)
```sql
-- Criar Tabela
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  other_ministries TEXT[], -- Array de textos
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alterar Tabela (Adicionar Coluna)
ALTER TABLE members ADD COLUMN birth_date DATE;
```

### DML (Manipulação de Dados)
```sql
-- Selecionar (Buscar)
SELECT id, name, email FROM members WHERE status = 'ACTIVE' ORDER BY name;

-- Inserir
INSERT INTO members (name, email) VALUES ('João Silva', 'joao@email.com');

-- Atualizar
UPDATE members SET status = 'INACTIVE' WHERE id = 'uuid-do-membro';
```