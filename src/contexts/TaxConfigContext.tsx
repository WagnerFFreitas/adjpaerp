import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Faixas de INSS
export interface FaixaINSS {
  limite: number;
  aliquota: number;
}

// Faixas de IRRF
export interface FaixaIRRF {
  limite: number;
  aliquota: number;
  deducao: number;
}

export interface TaxConfig {
  // Tabela INSS
  tabelaINSS: FaixaINSS[];
  tetoINSS: number;
  
  // Tabela IRRF
  tabelaIRRF: FaixaIRRF[];
  deducaoDependenteIRRF: number;
  
  // FGTS
  aliquotaFGTS: number;
  
  // INSS Patronal
  aliquotaINSSPatronal: number;
  
  // Vale-transporte
  limiteValeTransporte: number;
  
  // Data da última atualização
  ultimaAtualizacao: string;
}

// Valores padrão baseados na legislação de 2024
const defaultTaxConfig: TaxConfig = {
  tabelaINSS: [
    { limite: 1412.00, aliquota: 7.5 },
    { limite: 2666.68, aliquota: 9.0 },
    { limite: 4000.03, aliquota: 12.0 },
    { limite: 7786.02, aliquota: 14.0 },
  ],
  tetoINSS: 908.85,
  
  tabelaIRRF: [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 7.5, deducao: 169.44 },
    { limite: 3751.05, aliquota: 15.0, deducao: 381.44 },
    { limite: 4664.68, aliquota: 22.5, deducao: 662.77 },
    { limite: Infinity, aliquota: 27.5, deducao: 896.00 },
  ],
  deducaoDependenteIRRF: 189.59,
  
  aliquotaFGTS: 8.0,
  aliquotaINSSPatronal: 23.0,
  limiteValeTransporte: 6.0,
  
  ultimaAtualizacao: "2024-01-01",
};

const STORAGE_KEY = "gestaoplus_tax_config";

interface TaxConfigContextType {
  config: TaxConfig;
  updateConfig: (newConfig: Partial<TaxConfig>) => void;
  resetToDefaults: () => void;
}

const TaxConfigContext = createContext<TaxConfigContextType | undefined>(undefined);

export function TaxConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TaxConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultTaxConfig, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Erro ao carregar configurações tributárias:", e);
    }
    return defaultTaxConfig;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<TaxConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      ultimaAtualizacao: new Date().toISOString().split("T")[0],
    }));
  };

  const resetToDefaults = () => {
    setConfig(defaultTaxConfig);
  };

  return (
    <TaxConfigContext.Provider value={{ config, updateConfig, resetToDefaults }}>
      {children}
    </TaxConfigContext.Provider>
  );
}

export function useTaxConfig() {
  const context = useContext(TaxConfigContext);
  if (context === undefined) {
    throw new Error("useTaxConfig must be used within a TaxConfigProvider");
  }
  return context;
}

// Hook utilitário para cálculos
export function useTaxCalculations() {
  const { config } = useTaxConfig();

  const calcularINSS = (salarioBruto: number): number => {
    let inss = 0;
    let salarioRestante = salarioBruto;
    let faixaAnterior = 0;

    for (const faixa of config.tabelaINSS) {
      if (salarioRestante <= 0) break;
      
      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
      inss += baseCalculo * (faixa.aliquota / 100);
      salarioRestante -= baseCalculo;
      faixaAnterior = faixa.limite;
    }

    return Math.min(inss, config.tetoINSS);
  };

  const calcularIRRF = (baseCalculo: number, dependentes: number): number => {
    const baseComDeducoes = baseCalculo - (dependentes * config.deducaoDependenteIRRF);
    
    if (baseComDeducoes <= 0) return 0;

    for (const faixa of config.tabelaIRRF) {
      if (baseComDeducoes <= faixa.limite) {
        return Math.max(0, baseComDeducoes * (faixa.aliquota / 100) - faixa.deducao);
      }
    }

    const ultimaFaixa = config.tabelaIRRF[config.tabelaIRRF.length - 1];
    return Math.max(0, baseComDeducoes * (ultimaFaixa.aliquota / 100) - ultimaFaixa.deducao);
  };

  const calcularFGTS = (salarioBruto: number): number => {
    return salarioBruto * (config.aliquotaFGTS / 100);
  };

  const calcularINSSPatronal = (salarioBruto: number): number => {
    return salarioBruto * (config.aliquotaINSSPatronal / 100);
  };

  const calcularValeTransporte = (salarioBruto: number, valorVT: number): number => {
    const limiteDesconto = salarioBruto * (config.limiteValeTransporte / 100);
    return Math.min(valorVT, limiteDesconto);
  };

  return {
    calcularINSS,
    calcularIRRF,
    calcularFGTS,
    calcularINSSPatronal,
    calcularValeTransporte,
    config,
  };
}
