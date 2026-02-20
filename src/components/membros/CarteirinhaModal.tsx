import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarteirinhaPrintSheet } from "./CarteirinhaPrintSheet";
import { CarteirinhaCard } from "./CarteirinhaCard";
import logoAdjpa from "@/assets/logo-adjpa.jpg";

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

interface CarteirinhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membros: Membro[];
  preSelectedIds?: string[];
}

export function CarteirinhaModal({
  open,
  onOpenChange,
  membros,
  preSelectedIds = [],
}: CarteirinhaModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(preSelectedIds);
  const [igrejaNome, setIgrejaNome] = useState("AD Jesus Pão que Alimenta");
  const [dataValidade, setDataValidade] = useState("12/2026");
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Carteirinhas_Membros",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === membros.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(membros.map((m) => m.id));
    }
  };

  const selectedMembros = membros.filter((m) =>
    selectedIds.includes(m.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Impressão de Carteirinhas</DialogTitle>
          <DialogDescription>
            Selecione os membros e configure as opções de impressão
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de membros */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Membros</h3>
                <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                  {selectedIds.length === membros.length
                    ? "Desmarcar todos"
                    : "Selecionar todos"}
                </Button>
              </div>

              <ScrollArea className="h-[300px] border rounded-lg p-2">
                <div className="space-y-2">
                  {membros.map((membro) => (
                    <div
                      key={membro.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedIds.includes(membro.id)
                          ? "bg-secondary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleSelect(membro.id)}
                    >
                      <Checkbox
                        checked={selectedIds.includes(membro.id)}
                        onCheckedChange={() => toggleSelect(membro.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{membro.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {membro.ministerio} • {membro.cargo || "Membro"}
                        </p>
                      </div>
                      {selectedIds.includes(membro.id) && (
                        <Check className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Configurações */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Nome da Igreja</Label>
                  <Input
                    value={igrejaNome}
                    onChange={(e) => setIgrejaNome(e.target.value)}
                    placeholder="Nome da igreja"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Validade</Label>
                  <Input
                    value={dataValidade}
                    onChange={(e) => setDataValidade(e.target.value)}
                    placeholder="MM/AAAA"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Prévia ({selectedIds.length} selecionado
                  {selectedIds.length !== 1 ? "s" : ""})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Esconder prévia" : "Mostrar prévia"}
                </Button>
              </div>

              {showPreview && selectedMembros.length > 0 && (
                <ScrollArea className="h-[350px] border rounded-lg p-4 bg-muted/30">
                  <div className="flex flex-col items-center gap-6">
                    {selectedMembros.slice(0, 2).map((membro) => (
                      <div key={membro.id} className="flex flex-col gap-3">
                        <div className="transform scale-90 origin-center">
                          <CarteirinhaCard
                            membro={membro}
                            igrejaNome={igrejaNome}
                            igrejaLogo={logoAdjpa}
                            dataValidade={dataValidade}
                            side="front"
                          />
                        </div>
                        <div className="transform scale-90 origin-center">
                          <CarteirinhaCard
                            membro={membro}
                            igrejaNome={igrejaNome}
                            igrejaLogo={logoAdjpa}
                            dataValidade={dataValidade}
                            side="back"
                          />
                        </div>
                      </div>
                    ))}
                    {selectedMembros.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{selectedMembros.length - 2} carteirinhas adicionais
                      </p>
                    )}
                  </div>
                </ScrollArea>
              )}

              {!showPreview && (
                <div className="h-[350px] border rounded-lg flex items-center justify-center bg-muted/30">
                  <p className="text-muted-foreground text-sm">
                    Clique em "Mostrar prévia" para visualizar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="gold"
            onClick={() => handlePrint()}
            disabled={selectedIds.length === 0}
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </Button>
        </DialogFooter>

        {/* Hidden print content */}
        <div className="hidden">
          <CarteirinhaPrintSheet
            ref={printRef}
            membros={selectedMembros}
            igrejaNome={igrejaNome}
            igrejaLogo={logoAdjpa}
            dataValidade={dataValidade}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
