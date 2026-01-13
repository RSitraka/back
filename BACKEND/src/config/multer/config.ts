import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerOptionsFiles = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './public/files';
      if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      const random = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString())
        .join('');
      cb(null, `${name}-${random}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(pdf)$/)) cb(null, true);
    else cb(new BadRequestException('Unsupported file type'), false);
  },
  limits: {
    files: 50,
    fileSize: 1024 * 1024 * 10,
  },
};

export const multerOptionsPhotos = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './public/photos';
      if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      const random = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString())
        .join('');
      cb(null, `${name}-${random}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) cb(null, true);
    else cb(new BadRequestException('Unsupported file type'), false);
  },
  limits: {
    files: 50,
    fileSize: 1024 * 1024 * 10,
  },
};

export const multerOptionsEmployes = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './public/employes';
      if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      const random = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString())
        .join('');
      cb(null, `${name}-${random}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(pdf|jpg|jpeg|png)$/)) cb(null, true);
    else cb(new BadRequestException('Unsupported file type'), false);
  },
  limits: {
    files: 50,
    fileSize: 1024 * 1024 * 10,
  },
};