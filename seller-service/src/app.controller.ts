import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RegisterSellerReqDto } from './dto/RegisterSellerReq.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'test' })
  test(body: any) {
    return this.appService.test(body);
  }

  @MessagePattern({ cmd: 'register' })
  async register(body: RegisterSellerReqDto) {
    return this.appService.register(body);
  }
}
