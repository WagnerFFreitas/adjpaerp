import { forwardRef } from "react";
import { CrachaCard } from "./CrachaCard";

interface Funcionario {
  id: number;
  nome: string;
  matricula: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  foto?: string;
  tipoSanguineo?: string;
  telefoneEmergencia?: string;
}

interface CrachaPrintSheetProps {
  funcionarios: Funcionario[];
  empresaNome?: string;
  empresaLogo?: string;
  dataValidade?: string;
}

export const CrachaPrintSheet = forwardRef<HTMLDivElement, CrachaPrintSheetProps>(
  ({ funcionarios, empresaNome, empresaLogo, dataValidade }, ref) => {
    // CR-80 card size: 5.4cm x 8.6cm
    // A4 landscape: 29.7cm x 21cm
    // With margins and gaps, we can fit 3 columns x 2 rows = 6 cards per page (front)
    // Then 6 cards for back on the next page

    const cardsPerPage = 6;
    const pages: Funcionario[][] = [];

    for (let i = 0; i < funcionarios.length; i += cardsPerPage) {
      pages.push(funcionarios.slice(i, i + cardsPerPage));
    }

    return (
      <div ref={ref} className="cracha-print-container">
        {pages.map((pageFuncionarios, pageIndex) => (
          <div key={pageIndex}>
            {/* Página da frente */}
            <div className="cracha-page">
              <div className="cracha-grid">
                {pageFuncionarios.map((funcionario) => (
                  <CrachaCard
                    key={`front-${funcionario.id}`}
                    funcionario={funcionario}
                    empresaNome={empresaNome}
                    empresaLogo={empresaLogo}
                    dataValidade={dataValidade}
                    side="front"
                  />
                ))}
              </div>
            </div>

            {/* Página do verso */}
            <div className="cracha-page">
              <div className="cracha-grid">
                {pageFuncionarios.map((funcionario) => (
                  <CrachaCard
                    key={`back-${funcionario.id}`}
                    funcionario={funcionario}
                    empresaNome={empresaNome}
                    empresaLogo={empresaLogo}
                    dataValidade={dataValidade}
                    side="back"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

CrachaPrintSheet.displayName = "CrachaPrintSheet";
