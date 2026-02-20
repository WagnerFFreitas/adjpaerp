import { QRCodeSVG } from "qrcode.react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CrachaCardProps {
  funcionario: {
    id: number;
    nome: string;
    matricula: string;
    cargo: string;
    departamento: string;
    dataAdmissao: string;
    foto?: string;
    tipoSanguineo?: string;
    telefoneEmergencia?: string;
  };
  empresaNome?: string;
  empresaLogo?: string;
  dataValidade?: string;
  side: "front" | "back";
}

export function CrachaCard({
  funcionario,
  empresaNome = "AD Jesus Pão que Alimenta",
  empresaLogo,
  dataValidade = "12/2026",
  side,
}: CrachaCardProps) {
  const initials = funcionario.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (side === "front") {
    return (
      <div className="cracha-card cracha-front">
        {/* Header com logo e nome da empresa */}
        <div className="cracha-header">
          {empresaLogo ? (
            <img src={empresaLogo} alt="Logo" className="cracha-logo" />
          ) : (
            <div className="cracha-logo-placeholder">
              <span className="text-[8px] font-bold text-primary">GP</span>
            </div>
          )}
          <span className="cracha-empresa">{empresaNome}</span>
        </div>

        {/* Foto do funcionário */}
        <div className="cracha-foto-container">
          <Avatar className="cracha-foto">
            <AvatarImage src={funcionario.foto} alt={funcionario.nome} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Informações do funcionário */}
        <div className="cracha-info">
          <h3 className="cracha-nome">{funcionario.nome}</h3>
          <p className="cracha-cargo">{funcionario.cargo}</p>
          <p className="cracha-setor">{funcionario.departamento}</p>
        </div>

        {/* QRCode */}
        <div className="cracha-qrcode">
          <QRCodeSVG
            value={`FUNC:${funcionario.matricula}|${funcionario.nome}`}
            size={45}
            level="M"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cracha-card cracha-back">
      {/* Dados de identificação */}
      <div className="cracha-back-header">
        <div className="cracha-back-item">
          <span className="cracha-back-label">MATRÍCULA</span>
          <span className="cracha-back-value">{funcionario.matricula}</span>
        </div>
        <div className="cracha-back-item">
          <span className="cracha-back-label">ADMISSÃO</span>
          <span className="cracha-back-value">{funcionario.dataAdmissao}</span>
        </div>
        <div className="cracha-back-item">
          <span className="cracha-back-label">VALIDADE</span>
          <span className="cracha-back-value">{dataValidade}</span>
        </div>
      </div>

      {/* Dados vitais */}
      <div className="cracha-back-vitais">
        <h4 className="cracha-vitais-title">DADOS VITAIS</h4>
        <div className="cracha-vitais-grid">
          <div className="cracha-vitais-item">
            <span className="cracha-vitais-label">TIPO SANGUÍNEO:</span>
            <span className="cracha-vitais-value">
              {funcionario.tipoSanguineo || "___"}
            </span>
          </div>
          <div className="cracha-vitais-item">
            <span className="cracha-vitais-label">EMERGÊNCIA:</span>
            <span className="cracha-vitais-value">
              {funcionario.telefoneEmergencia || "(__)_____-____"}
            </span>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="cracha-back-footer">
        <p className="text-[6px] text-muted-foreground text-center">
          Este crachá é de uso pessoal e intransferível.
          <br />
          Em caso de perda, comunique imediatamente o RH.
        </p>
      </div>
    </div>
  );
}
