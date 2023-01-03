import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'test' })
  test(body: any) {
    return this.appService.test(body);
  }

  @MessagePattern({ cmd: 'templateList' })
  async getTemplateList(body: any) {
    return this.appService.getProductTemplateList();
  }
}
