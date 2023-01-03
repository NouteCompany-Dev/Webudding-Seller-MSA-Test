import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    @Inject('Seller_Service') private readonly sellerServiceApp: ClientProxy,
    @Inject('Product_Service') private readonly productServiceApp: ClientProxy,
  ) {}

  test(body: any) {
    const pattern = { cmd: 'test' };
    const payload = { test: body };
    return this.sellerServiceApp
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }

  // 셀러

  // 입점신청
  async register(body: any) {
    const pattern = { cmd: 'register' };
    const payload = { registerDto: body };
    return this.sellerServiceApp
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }

  // 로그인
  async login(body: any) {
    const pattern = { cmd: 'login' };
    const payload = { loginDto: body };
    return this.sellerServiceApp
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }

  async addInfo(files: File[], body: any) {
    const pattern = { cmd: 'addInfo' };
    const payload = {
      loginDto: {
        files,
        body,
      },
    };
    return this.sellerServiceApp
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }

  // 상품

  async getTemplateList() {
    const pattern = { cmd: 'templateList' };
    const payload = {};
    return this.productServiceApp
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }
}
