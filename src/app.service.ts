import { BadRequestException, Injectable } from '@nestjs/common';
import * as office from 'officeparser';

@Injectable()
export class AppService {
  async extract(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nie przesłano pliku');
    }

    try {
      const officeData = await office.parseOfficeAsync(file.buffer);
      return { data: officeData };
    } catch (e) {
      console.log(e);
    }
  }
}
