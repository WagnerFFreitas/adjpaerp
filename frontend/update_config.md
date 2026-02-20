# Atualização do Frontend para PostgreSQL Local

## 📋 Mudanças Necessárias

### 1. Remover Dependência do Supabase Client

O Supabase fornece autenticação e API automática. Com PostgreSQL local, precisamos implementar nossa própria camada de API.

### 2. Opções de Implementação

#### Opção A: API REST com Node.js + Express

**Vantagens:**
- Controle total sobre a API
- Fácil de implementar
- Boa performance

**Implementação:**

```bash
# Criar pasta para API
mkdir api
cd api
npm init -y
npm install express pg cors dotenv bcrypt jsonwebtoken
```

**Criar `api/server.js`:**

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3001;

// Configurar pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rota de login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM login($1, $2)',
      [email, password]
    );
    
    if (result.rows[0].success) {
      res.json({
        token: result.rows[0].token,
        user_id: result.rows[0].user_id
      });
    } else {
      res.status(401).json({ error: result.rows[0].message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exemplo de rota protegida
app.get('/api/members', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members WHERE unit_id = $1',
      [req.user.unit_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
```

#### Opção B: PostgREST (API automática)

**Vantagens:**
- API REST automática baseada no schema
- Menos código para manter
- Compatível com Supabase client

**Instalação:**

```bash
# Linux
sudo apt install postgrest

# macOS
brew install postgrest

# Windows - baixar de https://github.com/PostgREST/postgrest/releases
```

**Configurar `postgrest.conf`:**

```conf
db-uri = "postgres://adjpa_user:SenhaSeg123!@localhost:5432/adjpa_erp"
db-schema = "public"
db-anon-role = "adjpa_user"
server-host = "*"
server-port = 3000
jwt-secret = "sua_chave_secreta_aqui"
```

**Iniciar:**

```bash
postgrest postgrest.conf
```

### 3. Atualizar Cliente no Frontend

**Criar `src/lib/database.ts`:**

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funções de autenticação
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },
};

// Funções de dados
export const db = {
  members: {
    list: async () => {
      const response = await api.get('/members');
      return response.data;
    },
    
    get: async (id: string) => {
      const response = await api.get(`/members/${id}`);
      return response.data;
    },
    
    create: async (data: any) => {
      const response = await api.post('/members', data);
      return response.data;
    },
    
    update: async (id: string, data: any) => {
      const response = await api.put(`/members/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      await api.delete(`/members/${id}`);
    },
  },
  
  // Adicionar outros recursos...
};

export default api;
```

### 4. Atualizar Contexto de Autenticação

**Atualizar `src/contexts/AuthContext.tsx`:**

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/database';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    if (token) {
      auth.getUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await auth.login(email, password);
    setUser(data.user);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 5. Atualizar Variáveis de Ambiente

**Criar `.env.local`:**

```env
VITE_API_URL=http://localhost:3001/api

# Para rede local, use o IP do servidor
# VITE_API_URL=http://192.168.1.100:3001/api
```

### 6. Executar

```bash
# Terminal 1: API
cd api
node server.js

# Terminal 2: Frontend
npm run dev
```

## 🔄 Migração Gradual

Se quiser manter Supabase temporariamente:

1. Mantenha Supabase Auth na nuvem
2. Migre apenas os dados para PostgreSQL local
3. Use PostgREST para API local
4. Gradualmente substitua chamadas do Supabase

## 📝 Checklist

- [ ] Instalar PostgreSQL
- [ ] Executar migrations
- [ ] Escolher opção de API (Express ou PostgREST)
- [ ] Implementar API
- [ ] Atualizar cliente no frontend
- [ ] Atualizar contexto de autenticação
- [ ] Testar login
- [ ] Testar operações CRUD
- [ ] Configurar backup automático
- [ ] Documentar para equipe
