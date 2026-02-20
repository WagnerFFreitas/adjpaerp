import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Layout
import { AppLayout } from "@/components/layout/AppLayout";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/auth/Register";

// Pages
import Dashboard from "@/pages/Dashboard";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/NotFound";

// RH Pages
import RHDashboard from "@/pages/rh/RHDashboard";
import Remuneracao from "@/pages/rh/Remuneracao";
import Encargos from "@/pages/rh/Encargos";
import CalculoFolha from "@/pages/rh/CalculoFolha";

// Funcionarios Pages
import FuncionariosList from "@/pages/funcionarios/FuncionariosList";
import FuncionarioForm from "@/pages/funcionarios/FuncionarioForm";

// Financeiro Pages
import FinanceiroDashboard from "@/pages/financeiro/FinanceiroDashboard";
import ContasPagar from "@/pages/financeiro/ContasPagar";
import ContasReceber from "@/pages/financeiro/ContasReceber";
import TiposPagamento from "@/pages/financeiro/TiposPagamento";
import Caixa from "@/pages/financeiro/Caixa";

// Igreja Pages
import IgrejaDashboard from "@/pages/igreja/IgrejaDashboard";
import MembrosList from "@/pages/igreja/MembrosList";
import MembroForm from "@/pages/igreja/MembroForm";
import Financeiro from "@/pages/igreja/Financeiro";
import Eventos from "@/pages/igreja/Eventos";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* RH Routes */}
              <Route path="/rh" element={<RHDashboard />} />
              <Route path="/rh/trabalhista" element={<FuncionariosList />} />
              <Route path="/rh/remuneracao" element={<Remuneracao />} />
              <Route path="/rh/encargos" element={<Encargos />} />
              <Route path="/rh/afastamentos" element={<RHDashboard />} />
              <Route path="/rh/folha-pagamento" element={<CalculoFolha />} />
              <Route path="/rh/folha-pagamento/:id" element={<CalculoFolha />} />
              
              {/* Funcionarios Routes */}
              <Route path="/funcionarios" element={<FuncionariosList />} />
              <Route path="/funcionarios/novo" element={<FuncionarioForm />} />
              <Route path="/funcionarios/:id" element={<FuncionarioForm />} />
              <Route path="/funcionarios/:id/editar" element={<FuncionarioForm />} />
              <Route path="/funcionarios/documentos" element={<FuncionariosList />} />
              
              {/* Financeiro Routes */}
              <Route path="/financeiro" element={<FinanceiroDashboard />} />
              <Route path="/financeiro/caixa" element={<Caixa />} />
              <Route path="/financeiro/contas-pagar" element={<ContasPagar />} />
              <Route path="/financeiro/contas-pagar/nova" element={<ContasPagar />} />
              <Route path="/financeiro/contas-receber" element={<ContasReceber />} />
              <Route path="/financeiro/contas-receber/nova" element={<ContasReceber />} />
              <Route path="/financeiro/tipos-pagamento" element={<TiposPagamento />} />
              <Route path="/financeiro/movimentacoes" element={<FinanceiroDashboard />} />
              <Route path="/financeiro/relatorios" element={<FinanceiroDashboard />} />
              
              {/* Igreja Routes */}
              <Route path="/igreja" element={<IgrejaDashboard />} />
              <Route path="/igreja/membros" element={<MembrosList />} />
              <Route path="/igreja/membros/novo" element={<MembroForm />} />
              <Route path="/igreja/vida-crista" element={<IgrejaDashboard />} />
              <Route path="/igreja/financeiro" element={<Financeiro />} />
              <Route path="/igreja/eventos" element={<Eventos />} />
              <Route path="/igreja/comunicacao" element={<IgrejaDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/obreiros" element={<AdminDashboard />} />
              <Route path="/admin/patrimonio" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminDashboard />} />
              <Route path="/admin/relatorios" element={<AdminDashboard />} />
              
              {/* Settings */}
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
