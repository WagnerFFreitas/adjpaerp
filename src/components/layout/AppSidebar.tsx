import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Church,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  Heart,
  Menu,
  X,
  Wallet,
  CreditCard,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoAdjpa from "@/assets/logo-adjpa.jpg";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Departamento Pessoal",
    href: "/rh",
    icon: Briefcase,
    children: [
      { title: "Visão Geral", href: "/rh" },
      { title: "Funcionários", href: "/funcionarios" },
      { title: "Remuneração", href: "/rh/remuneracao" },
      { title: "Folha de Pagamento", href: "/rh/folha-pagamento" },
      { title: "Encargos", href: "/rh/encargos" },
      { title: "Afastamentos", href: "/rh/afastamentos" },
      { title: "Documentos", href: "/funcionarios/documentos" },
    ],
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
    children: [
      { title: "Visão Geral", href: "/financeiro" },
      { title: "Caixa", href: "/financeiro/caixa" },
      { title: "Contas a Pagar", href: "/financeiro/contas-pagar" },
      { title: "Contas a Receber", href: "/financeiro/contas-receber" },
      { title: "Tipos de Pagamento", href: "/financeiro/tipos-pagamento" },
      { title: "Relatórios", href: "/financeiro/relatorios" },
    ],
  },
  {
    title: "Igreja",
    href: "/igreja",
    icon: Church,
    children: [
      { title: "Visão Geral", href: "/igreja" },
      { title: "Membros", href: "/igreja/membros" },
      { title: "Vida Cristã", href: "/igreja/vida-crista" },
      { title: "Financeiro", href: "/igreja/financeiro" },
      { title: "Eventos", href: "/igreja/eventos" },
      { title: "Comunicação", href: "/igreja/comunicacao" },
    ],
  },
  {
    title: "Administração",
    href: "/admin",
    icon: Building2,
    children: [
      { title: "Obreiros e Pastores", href: "/admin/obreiros" },
      { title: "Patrimônio", href: "/admin/patrimonio" },
      { title: "Usuários", href: "/admin/usuarios" },
      { title: "Relatórios", href: "/admin/relatorios" },
    ],
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(["/rh", "/funcionarios", "/igreja", "/admin", "/financeiro"]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname.startsWith(child.href)) ||
    location.pathname === item.href;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={logoAdjpa} 
            alt="Logo ADJPA" 
            className="w-12 h-12 rounded-xl object-contain bg-white"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-sm font-bold text-sidebar-foreground leading-tight">
              AD Jesus Pão que Alimenta
            </h1>
            <p className="text-xs text-sidebar-foreground/60">RH & Igreja</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    "sidebar-item w-full justify-between",
                    isParentActive(item) && "sidebar-item-active"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.href) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.href) && (
                  <div className="ml-8 mt-1 space-y-1 animate-fade-in">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "block px-4 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
                          isActive(child.href) && "text-sidebar-primary bg-sidebar-accent font-medium"
                        )}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "sidebar-item-active"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile?.name || 'Usuário'}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {profile?.username || ''}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-40 transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
