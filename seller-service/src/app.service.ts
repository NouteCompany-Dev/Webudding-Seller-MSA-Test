import { SellerRepository } from './repository/Seller.repository';
import { Injectable, Logger } from '@nestjs/common';
import {
  AddInfoSellerReqDto,
  RegisterSellerReqDto,
} from './dto/RegisterSellerReq.dto';
import { BusinessOption, SellerStatus } from './entity/enum/enum';
import { LoginSellerReqDto } from './dto/LoginSellerReq.dto';
import { GenDigestPwd } from './lib/crypto';
import * as jwt from 'jsonwebtoken';

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

  async login(body: LoginSellerReqDto): Promise<any> {
    try {
      Logger.log(`API - Seller Login ${body.email}`);
      let status = 0;
      let resultCode = 0;
      let data = null;
      const { email, password } = body;
      const seller = await this.sellerRepository.findByEmail(email);
      // 존재하지 않는 셀러
      if (seller === undefined) {
        return { status: 201, resultCode: 6011, data: null };
      }
      const sellerId = seller.id;
      const sellerInfo = await this.sellerRepository.getSellerInfo(sellerId);
      const hashPassword = GenDigestPwd(password);
      const sellerJwtSecret = process.env.SELLER_JWT_SECRET_KEY;
      const accessToken = jwt.sign({ sellerId }, sellerJwtSecret, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign({ sellerId }, sellerJwtSecret, {
        expiresIn: '1d',
      });
      // 비밀번호 오류
      if (seller.password != hashPassword) {
        status = 202;
        resultCode = 6012;
      }
      // 비활성 셀러
      else if (seller.enable != true) {
        status = 203;
        resultCode = 6013;
      }
      // 작가정보입력 단계 셀러
      else if (seller.status == SellerStatus.required) {
        let sellerType = sellerInfo.sellerType;
        data = { sellerId, sellerType };
        status = 204;
        resultCode = 6014;
      }
      // 승인대기 셀러
      else if (seller.status == SellerStatus.registered) {
        let sellerType = sellerInfo.sellerType;
        data = sellerType;
        status = 205;
        resultCode = 6015;
      }
      // 승인반려 셀러
      else if (seller.status == SellerStatus.rejected) {
        data = {
          accessToken,
          refreshToken,
        };
        status = 206;
        resultCode = 6016; // 반려 계정 && 로그인 가능
      }
      // 승인완료 셀러
      else {
        data = {
          accessToken,
          refreshToken,
        };
        status = 200;
        resultCode = 1;
      }
      return { status: status, resultCode: resultCode, data: data };
    } catch (err) {
      console.log(err);
      return { status: 401, resultCode: 6017, data: null };
    }
  }

  async addInfo(files: File[], body: AddInfoSellerReqDto): Promise<any> {
    try {
      Logger.log(`API - Seller Add Info`);
      let status = 0;
      let resultCode = 0;
      let data = null;
      const { brandName, englishBrandName } = body;
      const brandNameCheck = await this.sellerRepository.checkBrandName(
        brandName,
      );
      const englishBrandNameCheck =
        await this.sellerRepository.checkEnglishBrandName(englishBrandName);
      // 이미 존재하는 브랜드명
      if (brandNameCheck) {
        status = 201;
        resultCode = 6021;
      }
      // 이미 존재하는 영문 브랜드명
      else if (englishBrandNameCheck) {
        status = 202;
        resultCode = 6022;
      }
      // 셀러 정보 입력
      else {
        await this.sellerRepository.addSellerInfo(files, body);
        status = 200;
        resultCode = 1;
      }
      return { status: status, resultCode: resultCode, data: data };
    } catch (err) {
      console.log(err);
      return { status: 401, resultCode: 6023, data: null };
    }
  }
}
