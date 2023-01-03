import { SellerRepository } from './repository/Seller.repository';
import { Injectable, Logger } from '@nestjs/common';
import { RegisterSellerReqDto } from './dto/RegisterSellerReq.dto';
import { BusinessOption } from './entity/enum/enum';

@Injectable()
export class AppService {
  constructor(private sellerRepository: SellerRepository) {}

  async test(body: any) {
    const { test } = body;
    console.log(test);
    let data = test;
    return data;
  }

  async register(body: RegisterSellerReqDto): Promise<any> {
    try {
      Logger.log(`API - Seller Register ${body.email}`);
      let data = null;
      let status = 0;
      let resultCode = 0;
      const { name, email, phone, businessOption, bankAccount } = body;
      const checkEmail = await this.sellerRepository.checkEmail(email);
      const checkPhone = await this.sellerRepository.checkPhone(phone);
      const checkBankAccount = await this.sellerRepository.checkBankAccount(
        bankAccount,
      );
      // 이미 존재하는 이메일
      if (checkEmail) {
        status = 201;
        resultCode = 6001;
      }
      // 이미 존재하는 휴대폰 번호
      else if (checkPhone != null) {
        status = 202;
        resultCode = 6002;
      }
      // 이미 존재하는 계좌번호
      else if (checkBankAccount) {
        status = 203;
        resultCode = 6003;
      }
      // 개인 작가
      else {
        if (businessOption == BusinessOption.personal) {
          await this.sellerRepository.personalRegister(body);
        }
        // 사업자 작가
        else {
          await this.sellerRepository.businessRegister(body);
        }
        status = 200;
        resultCode = 1;
      }

      return { status: status, resultCode: resultCode, data: data };
    } catch (err) {
      console.log(err);
      return { resultCode: 6006, data: null };
    }
  }
}
