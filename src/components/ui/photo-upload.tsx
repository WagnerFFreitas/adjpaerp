import React, { useState, useRef } from 'react';
import { User, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';
import { uploadApi } from '@/lib/api';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  type: 'employee' | 'member' | 'profile';
  id: string;
  className?: string;
}

export function PhotoUpload({ 
  currentPhotoUrl, 
  onPhotoChange, 
  type, 
  id, 
  className = "w-32 h-32" 
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não permitido",
        description: "Use apenas JPG, PNG, GIF ou WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Criar preview local
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Fazer upload
      const result = await uploadApi.uploadPhoto(file, type, id);
      
      console.log('Upload result:', result); // Debug
      
      // Usar a URL direta para a imagem
      const realUrl = `http://localhost:3001/uploads/${result.data.filename}`;
      console.log('Real URL:', realUrl); // Debug
      
      setPreviewUrl(realUrl);
      onPhotoChange(realUrl);

      // Limpar preview local
      URL.revokeObjectURL(localPreview);

      toast({
        title: "Foto enviada com sucesso",
        description: "A foto foi atualizada.",
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      
      // Reverter preview em caso de erro
      setPreviewUrl(currentPhotoUrl || null);
      
      toast({
        title: "Erro no upload",
        description: error.response?.data?.message || "Erro ao enviar foto.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!previewUrl) return;

    try {
      setPreviewUrl(null);
      onPhotoChange(null);

      toast({
        title: "Foto removida",
        description: "A foto foi removida com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: "Erro ao remover foto",
        description: error.response?.data?.message || "Erro ao remover foto.",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          ${className} rounded-xl bg-muted flex flex-col items-center justify-center 
          border-2 border-dashed border-border cursor-pointer 
          hover:border-primary transition-colors relative overflow-hidden
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onClick={handleClick}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Foto" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', previewUrl);
                // Fallback para ícone se a imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
                target.parentElement?.insertAdjacentHTML('beforeend', 
                  '<div class="flex flex-col items-center"><svg class="w-10 h-10 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path></svg><span class="text-xs text-red-500">Erro ao carregar</span></div>'
                );
              }}
              onLoad={() => {
                console.log('Imagem carregada com sucesso:', previewUrl);
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <>
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-muted-foreground mb-2 animate-spin" />
            ) : (
              <User className="w-10 h-10 text-muted-foreground mb-2" />
            )}
            <span className="text-xs text-muted-foreground text-center px-2">
              {isUploading ? 'Enviando...' : 'Upload Foto'}
            </span>
          </>
        )}
      </div>

      {/* Botão de remover foto */}
      {previewUrl && !isUploading && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handleRemovePhoto();
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}