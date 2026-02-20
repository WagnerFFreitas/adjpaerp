import { QRCodeSVG } from "qrcode.react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "@/styles/carteirinha.css";

interface CarteirinhaCardProps {
  membro: {
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
  };
  igrejaNome?: string;
  igrejaLogo?: string;
  dataValidade?: string;
  side: "front" | "back";
}

export function CarteirinhaCard({
  membro,
  igrejaNome = "AD Jesus Pão que Alimenta",
  igrejaLogo,
  dataValidade = "12/2026",
  side,
}: CarteirinhaCardProps) {
  const initials = membro.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (side === "front") {
    return (
      <div className="carteirinha-horizontal carteirinha-front">
        {/* Layout horizontal com foto à esquerda e informações à direita */}
        <div className="carteirinha-left">
          {/* Logo no topo */}
          <div className="carteirinha-logo-area">
            {igrejaLogo ? (
              <img src={igrejaLogo} alt="Logo" className="carteirinha-logo" />
            ) : (
              <div className="carteirinha-logo-placeholder">
                <span className="text-[8px] font-bold text-secondary">AD</span>
              </div>
            )}
          </div>
          {/* Foto */}
          <Avatar className="carteirinha-foto">
            <AvatarImage src={membro.foto} alt={membro.nome} />
            <AvatarFallback className="text-base font-semibold bg-secondary/10 text-secondary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="carteirinha-right">
          {/* Nome da igreja */}
          <div className="carteirinha-header-text">
            <span className="text-[7px] font-bold text-primary uppercase tracking-wide">
              {igrejaNome}
            </span>
          </div>
          
          {/* Informações do membro */}
          <div className="carteirinha-info-area">
            <h3 className="carteirinha-nome">{membro.nome}</h3>
            <p className="carteirinha-cargo">{membro.posicaoEclesiastica || membro.cargo || "Membro"}</p>
            <p className="carteirinha-ministerio">{membro.ministerio || "Ministério"}</p>
          </div>
          
          {/* QRCode */}
          <div className="carteirinha-qr">
            <QRCodeSVG
              value={`MEMBRO:${membro.id}|${membro.nome}`}
              size={38}
              level="M"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carteirinha-horizontal carteirinha-back-h">
      {/* Verso horizontal */}
      <div className="carteirinha-back-content">
        {/* Dados de identificação em linha */}
        <div className="carteirinha-dados-linha">
          <div className="carteirinha-dado">
            <span className="carteirinha-label">MEMBRO DESDE</span>
            <span className="carteirinha-value">{membro.membroDesde || "___/___"}</span>
          </div>
          <div className="carteirinha-dado">
            <span className="carteirinha-label">BATISMO</span>
            <span className="carteirinha-value">{membro.dataBatismo || "___/___"}</span>
          </div>
          <div className="carteirinha-dado">
            <span className="carteirinha-label">VALIDADE</span>
            <span className="carteirinha-value">{dataValidade}</span>
          </div>
        </div>
        
        {/* Dados de emergência */}
        <div className="carteirinha-emergencia">
          <h4 className="carteirinha-emergencia-title">DADOS DE EMERGÊNCIA</h4>
          <div className="carteirinha-emergencia-grid">
            <div className="carteirinha-emergencia-item">
              <span className="carteirinha-emergencia-label">TIPO SANGUÍNEO:</span>
              <span className="carteirinha-emergencia-value">{membro.tipoSanguineo || "___"}</span>
            </div>
            <div className="carteirinha-emergencia-item">
              <span className="carteirinha-emergencia-label">CONTATO:</span>
              <span className="carteirinha-emergencia-value">{membro.contatoEmergencia || "(__)_____-____"}</span>
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="carteirinha-footer">
          <p>Esta carteirinha é de uso pessoal e intransferível. Em caso de perda, comunique a secretaria.</p>
        </div>
      </div>
    </div>
  );
}
