/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { BadRequestException, Injectable } from '@nestjs/common';
import * as office from 'officeparser';

@Injectable()
export class AppService {
  async extract(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nie przesłano pliku');
    }

    const name = file.originalname;

    if (
      name.endsWith('.pdf') ||
      name.endsWith('.docx') ||
      name.endsWith('.doc')
    ) {
      const officeData = await office.parseOfficeAsync(file.buffer);
      return { data: officeData };
    } else {
      throw new BadRequestException(
        'Przesłany plik nie jest w odpowiednim formacie.',
      );
    }
  }
}
