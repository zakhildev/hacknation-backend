/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class AppService {
  async extractPDF(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nie przesłano pliku');
    }

    if (!file.originalname.endsWith('.pdf')) {
      throw new BadRequestException('Przesłany plik nie jest plikiem PDF.');
    }

    const parser = new PDFParse({
      data: file.buffer,
    });

    const content = await parser.getText();
    return {
      data: content.text,
    };
  }
}
