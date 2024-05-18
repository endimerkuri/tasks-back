import { Injectable } from '@nestjs/common';

export interface Response {
  message: string;
}

@Injectable()
export class AppService {
  getHello(): Response {
    return { message: 'Hello World!' };
  }
}
