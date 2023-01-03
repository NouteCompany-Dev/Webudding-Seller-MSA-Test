import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('MSA')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('test')
  test(@Body('test') body: string) {
    return this.appService.test(body);
  }

  // 셀러

  // 입점신청
  @Post('seller/register')
  @ApiOperation({ summary: '국내 셀러 입점신청' })
  async register(body: any): Promise<any> {
    try {
      const result = await this.appService.register(body);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 로그인
  @Post('seller/login')
  @ApiOperation({ summary: '로그인' })
  async login(body: any): Promise<any> {
    try {
      const result = await this.appService.login(body);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 작가정보입력
  @Post('seller/addInfo')
  @ApiOperation({ summary: '작가정보입력' })
  async addInfo(files: File[], body: any): Promise<any> {
    try {
      const result = await this.appService.addInfo(files, body);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // 상품
  @Get('product/template/list')
  @ApiOperation({ summary: '상품 상세정보 템플릿 리스트 조회' })
  async getTemplateList(): Promise<any> {
    try {
      const result = await this.appService.getTemplateList();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
