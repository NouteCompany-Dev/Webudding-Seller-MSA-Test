import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('test')
  test(@Body('test') body: string) {
    return this.appService.test(body);
  }

  // 셀러

  @Post('seller/register')
  async register(body: any): Promise<any> {
    try {
      const result = await this.appService.register(body);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 상품

  @Get('product/template/list')
  async getTemplateList(): Promise<any> {
    try {
      const result = await this.appService.getTemplateList();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
