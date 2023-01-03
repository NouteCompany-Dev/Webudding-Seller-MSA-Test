import { LoginSellerReqDto } from './dto/LoginSellerReq.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  AddInfoSellerReqDto,
  RegisterSellerReqDto,
} from './dto/RegisterSellerReq.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'test' })
  test(body: any) {
    return this.appService.test(body);
  }

  // 입점신청
  @MessagePattern({ cmd: 'register' })
  async register(body: RegisterSellerReqDto) {
    return this.appService.register(body);
  }

  // 로그인
  @MessagePattern({ cmd: 'login' })
  async login(body: LoginSellerReqDto) {
    return this.appService.login(body);
  }

  // 작가정보입력
  @MessagePattern({ cmd: 'addInfo' })
  async addInfo(files: File[], body: AddInfoSellerReqDto) {
    return this.appService.addInfo(files, body);
  }
}
