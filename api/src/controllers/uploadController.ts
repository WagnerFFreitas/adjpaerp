import { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

export const uploadPhoto = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError('Nenhum arquivo foi enviado', 400);
  }

  const { type, id } = req.body;

  if (!type || !id) {
    // Remover arquivo se dados obrigatórios não foram fornecidos
    fs.unlinkSync(req.file.path);
    throw new AppError('Tipo e ID são obrigatórios', 400);
  }

  // Validar tipos permitidos
  const allowedTypes = ['employee', 'member', 'profile'];
  if (!allowedTypes.includes(type)) {
    fs.unlinkSync(req.file.path);
    throw new AppError('Tipo não permitido', 400);
  }

  // Gerar URL da foto
  const photoUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Foto enviada com sucesso',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: photoUrl,
      type,
      id
    }
  });
});

export const deletePhoto = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { filename } = req.params;

  if (!filename) {
    throw new AppError('Nome do arquivo é obrigatório', 400);
  }

  const filePath = path.join(__dirname, '../../uploads', filename);

  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    throw new AppError('Arquivo não encontrado', 404);
  }

  // Remover arquivo
  fs.unlinkSync(filePath);

  res.json({
    success: true,
    message: 'Foto removida com sucesso'
  });
});

export const getPhoto = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { filename } = req.params;

  if (!filename) {
    throw new AppError('Nome do arquivo é obrigatório', 400);
  }

  const filePath = path.join(__dirname, '../../uploads', filename);

  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    throw new AppError('Arquivo não encontrado', 404);
  }

  // Enviar arquivo
  res.sendFile(filePath);
});