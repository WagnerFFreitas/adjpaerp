import { forwardRef } from "react";
import { CarteirinhaCard } from "./CarteirinhaCard";
import "@/styles/carteirinha.css";

interface Membro {
  id: string;
  nome: string;
  ministerio?: string;
  cargo?: string;
  dataBatismo?: string;
  membroDesde?: string;
  posicaoEclesiastica?: string;
  foto?: string;
  telefone?: string;
  tipoSanguineo?: string;
  contatoEmergencia?: string;
}

interface CarteirinhaPrintSheetProps {
  membros: Membro[];
  igrejaNome?: string;
  igrejaLogo?: string;
  dataValidade?: string;
}

export const CarteirinhaPrintSheet = forwardRef<HTMLDivElement, CarteirinhaPrintSheetProps>(
  ({ membros, igrejaNome, igrejaLogo, dataValidade }, ref) => {
    // Layout horizontal: 8.6cm x 5.4cm por carteirinha
    // A4 landscape: 29.7cm x 21cm
    // Com margens, cabem 3 colunas x 3 linhas = 9 carteirinhas por página
    const cardsPerPage = 9;
    const pages: Membro[][] = [];
    
    for (let i = 0; i < membros.length; i += cardsPerPage) {
      pages.push(membros.slice(i, i + cardsPerPage));
    }

    return (
      <div ref={ref} className="carteirinha-print-container">
        <style>
          {`
            @media print {
              @page {
                size: A4 landscape;
                margin: 8mm;
              }
            }
            .carteirinha-print-container {
              background: white;
            }
            .carteirinha-print-page {
              width: 29.7cm;
              min-height: 21cm;
              padding: 0.5cm;
              page-break-after: always;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .carteirinha-print-page:last-child {
              page-break-after: auto;
            }
            .carteirinha-print-grid {
              display: grid;
              grid-template-columns: repeat(3, 8.6cm);
              grid-template-rows: repeat(3, 5.4cm);
              gap: 0.3cm;
              justify-content: center;
            }
            .carteirinha-print-cell {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}
        </style>
        {pages.map((pageMembros, pageIndex) => (
          <div key={pageIndex}>
            {/* Página de frentes */}
            <div className="carteirinha-print-page">
              <div className="carteirinha-print-grid">
                {pageMembros.map((membro) => (
                  <div key={`front-${membro.id}`} className="carteirinha-print-cell">
                    <CarteirinhaCard
                      membro={membro}
                      igrejaNome={igrejaNome}
                      igrejaLogo={igrejaLogo}
                      dataValidade={dataValidade}
                      side="front"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Página de versos */}
            <div className="carteirinha-print-page">
              <div className="carteirinha-print-grid">
                {pageMembros.map((membro) => (
                  <div key={`back-${membro.id}`} className="carteirinha-print-cell">
                    <CarteirinhaCard
                      membro={membro}
                      igrejaNome={igrejaNome}
                      igrejaLogo={igrejaLogo}
                      dataValidade={dataValidade}
                      side="back"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

CarteirinhaPrintSheet.displayName = "CarteirinhaPrintSheet";
