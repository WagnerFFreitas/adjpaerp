import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, FileDown, Check } from "lucide-react";
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
import { CrachaPrintSheet } from "./CrachaPrintSheet";
import { CrachaCard } from "./CrachaCard";
import logoAdjpa from "@/assets/logo-adjpa.jpg";

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

interface CrachaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionarios: Funcionario[];
  preSelectedIds?: number[];
}

export function CrachaModal({
  open,
  onOpenChange,
  funcionarios,
  preSelectedIds = [],
}: CrachaModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(preSelectedIds);
  const [empresaNome, setEmpresaNome] = useState("AD Jesus Pão que Alimenta");
  const [dataValidade, setDataValidade] = useState("12/2026");
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Crachas_Funcionarios",
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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === funcionarios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(funcionarios.map((f) => f.id));
    }
  };

  const selectedFuncionarios = funcionarios.filter((f) =>
    selectedIds.includes(f.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Impressão de Crachás</DialogTitle>
          <DialogDescription>
            Selecione os funcionários e configure as opções de impressão
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de funcionários */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
              <h3 className="font-medium">Funcionários</h3>
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                {selectedIds.length === funcionarios.length
                  ? "Desmarcar todos"
                  : "Selecionar todos"}
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-2">
              <div className="space-y-2">
                {funcionarios.map((funcionario) => (
                  <div
                    key={funcionario.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedIds.includes(funcionario.id)
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleSelect(funcionario.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(funcionario.id)}
                      onCheckedChange={() => toggleSelect(funcionario.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{funcionario.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {funcionario.cargo} • {funcionario.matricula}
                      </p>
                    </div>
                    {selectedIds.includes(funcionario.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Configurações */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input
                  value={empresaNome}
                  onChange={(e) => setEmpresaNome(e.target.value)}
                  placeholder="Nome da empresa"
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

            {showPreview && selectedFuncionarios.length > 0 && (
              <ScrollArea className="h-[350px] border rounded-lg p-4 bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                  {selectedFuncionarios.slice(0, 2).map((func) => (
                    <div key={func.id} className="flex gap-2">
                      <div className="scale-75 origin-top-left">
                        <CrachaCard
                          funcionario={func}
                          empresaNome={empresaNome}
                          empresaLogo={logoAdjpa}
                          dataValidade={dataValidade}
                          side="front"
                        />
                      </div>
                      <div className="scale-75 origin-top-left">
                        <CrachaCard
                          funcionario={func}
                          empresaNome={empresaNome}
                          empresaLogo={logoAdjpa}
                          dataValidade={dataValidade}
                          side="back"
                        />
                      </div>
                    </div>
                  ))}
                  {selectedFuncionarios.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{selectedFuncionarios.length - 2} crachás adicionais
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
            variant="gradient"
            onClick={() => handlePrint()}
            disabled={selectedIds.length === 0}
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </Button>
        </DialogFooter>

        {/* Hidden print content */}
        <div className="hidden">
          <CrachaPrintSheet
            ref={printRef}
            funcionarios={selectedFuncionarios}
            empresaNome={empresaNome}
            empresaLogo={logoAdjpa}
            dataValidade={dataValidade}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
