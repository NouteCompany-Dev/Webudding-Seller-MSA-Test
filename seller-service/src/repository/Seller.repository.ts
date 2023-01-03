import { SellerPopbillAccount } from 'src/entity/SellerPopbillAccount.entity';
import { SellerInfo } from 'src/entity/SellerInfo.entity';
import { Seller } from './../entity/Seller.entity';
import { EntityRepository, Repository, getRepository } from 'typeorm';
import {
  aesDencrypt,
  aesEncrypt,
  GenDigestPwd,
  rsaDencrypt,
  rsaEncrypt,
} from 'src/lib/crypto';
import { TemporaryProduct } from 'src/entity/TemporaryProduct.entity';
import { SellerLedger } from 'src/entity/SellerLedger.entity';
import {
  Currency,
  LedgerStatus,
  SellerStatus,
  SellerType,
} from 'src/entity/enum/enum';
import * as fs from 'fs';
import { SellerMinorFile } from 'src/entity/SellerMinorFile.entity';
import { cloudfrontPath } from 'src/modules/cloudfront';
import { SellerFile } from 'src/entity/SellerFiles.entity';
import { SellerHashTag } from 'src/entity/SellerHashTag.entity';
import { AddInfoEnglishSellerReqDto } from 'src/dto/RegisterSellerReq.dto';

@EntityRepository(Seller)
export class SellerRepository extends Repository<Seller> {
  async getSeller(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .where('s.id = :body', { body: body })
      .getOne();

    return seller;
  }

  async getSellerInfo(body: any): Promise<any> {
    const sellerInfo = await getRepository(SellerInfo)
      .createQueryBuilder('si')
      .where('si.sellerId = :body', { body: body })
      .getOne();

    return sellerInfo;
  }

  async getSellerAndEmail(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .where('s.email = :body', { body: body })
      .getOne();

    return seller;
  }

  async getSellerPopbillAccount(body: any): Promise<any> {
    const sellerPopbillAccount = await getRepository(SellerPopbillAccount)
      .createQueryBuilder('spa')
      .where('spa.sellerId = :body', { body: body })
      .getOne();

    return sellerPopbillAccount;
  }

  async checkEmail(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .where('s.email = :body', { body: body })
      .andWhere('s.enable = 1')
      .getOne();

    return seller;
  }

  async checkPhone(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .where('s.phone = :body', { body: body })
      .getOne();

    return seller;
  }

  async checkBankAccount(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.sellerInfo', 'si')
      .where('si.bankAccount = :body', { body: body })
      .andWhere('s.enable = 1')
      .getOne();

    return seller;
  }

  async checkBrandName(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.sellerInfo', 'si')
      .where('si.brandName = :body', { body: body })
      .andWhere('s.enable = 1')
      .getOne();

    return seller;
  }

  async checkEnglishBrandName(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.sellerInfo', 'si')
      .where('si.englishBrandName = :body', { body: body })
      .andWhere('s.enable = 1')
      .getOne();

    return seller;
  }

  async duplicateBrandName(body: any): Promise<any> {
    const { brandName, sellerId } = body;
    return await getRepository(SellerInfo)
      .createQueryBuilder('si')
      .where('si.brandName = :body', { body: brandName })
      .andWhere('si.sellerId != :sellerId', { sellerId: sellerId })
      .getOne();
  }

  async duplicateEnglishBrandName(body: any): Promise<any> {
    const { englishBrandName, sellerId } = body;
    return await getRepository(SellerInfo)
      .createQueryBuilder('si')
      .where('si.brandName = :body', { body: englishBrandName })
      .andWhere('si.sellerId != :sellerId', { sellerId: sellerId })
      .getOne();
  }

  async findByEmail(body: any): Promise<any> {
    const seller = await getRepository(Seller)
      .createQueryBuilder('s')
      .where('s.email = :body', { body: body })
      .getOne();

    return seller;
  }

  async getSellerLedgerData(body: any): Promise<any> {
    const data = await getRepository(SellerLedger)
      .createQueryBuilder('sl')
      .where('sl.sellerId = :body', { body: body })
      .andWhere('sl.currency = "KRW"')
      .orderBy('sl.createdAt', 'ASC')
      .getMany();

    return data;
  }

  async getSellerEnglishLedgerData(body: any): Promise<any> {
    const data = await getRepository(SellerLedger)
      .createQueryBuilder('sl')
      .where('sl.sellerId = :body', { body: body })
      .andWhere('sl.currency = "USD"')
      .orderBy('sl.createdAt', 'ASC')
      .getMany();

    return data;
  }

  async getSellerConfirmedLedgerData(body: any): Promise<any> {
    const data = await getRepository(SellerLedger)
      .createQueryBuilder('sl')
      .where('sl.sellerId = :body', { body: body })
      .andWhere('sl.ledgerStatus = "confirmed"')
      .getMany();

    return data;
  }

  async getManyHashTags(body: any): Promise<any> {
    const hashTags = await getRepository(SellerHashTag)
      .createQueryBuilder('sht')
      .where('sht.sellerId = :body', { body: body })
      .getMany();

    return hashTags;
  }

  async encryptPhone(body: any): Promise<any> {
    try {
      const encryptPhone = aesEncrypt(body);
      return encryptPhone;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async dencryptPhone(body: any) {
    try {
      const dencryptPhone = aesDencrypt(body);
      return dencryptPhone;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async encryptBankAccount(body: any) {
    try {
      const encryptAccount = aesEncrypt(body);
      return encryptAccount;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async dencryptBankAccount(body: any) {
    try {
      const dencryptAccount = aesDencrypt(body);
      return dencryptAccount;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async encryptResidentNumber(body: any) {
    try {
      const encryptResidentNumber = rsaEncrypt(body);
      return encryptResidentNumber;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async dencryptResidentNumber(body: any) {
    try {
      const dencryptResidentNumber = rsaDencrypt(body);
      return dencryptResidentNumber;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async encryptPassword(body: any) {
    try {
      const encryptPassword = GenDigestPwd(body);
      return encryptPassword;
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printEncryptPhone(body: any) {
    try {
      const { phone } = body;
      const encryptPhone = aesEncrypt(phone);
      console.log(encryptPhone);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printDencryptPhone(body: any) {
    try {
      const { phone } = body;
      const dencryptPhone = aesDencrypt(phone);
      console.log(dencryptPhone);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printEncryptBankAccount(body: any) {
    try {
      const { bankAccount } = body;
      const encryptBankAccount = aesEncrypt(bankAccount);
      console.log(encryptBankAccount);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printDencryptBankAccount(body: any) {
    try {
      const { bankAccount } = body;
      const dencryptBankAccount = aesDencrypt(bankAccount);
      console.log(dencryptBankAccount);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printEncryptResidentNumber(body: any) {
    try {
      const { residentNumber } = body;
      const encryptResidentNumber = rsaEncrypt(residentNumber);
      console.log(encryptResidentNumber);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printDencryptResidentNumber(body: any) {
    try {
      const { residentNumber } = body;
      const dencryptResidentNumber = rsaDencrypt(residentNumber);
      console.log(dencryptResidentNumber);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  async printEncryptPassword(body: any) {
    try {
      const { password } = body;
      const encryptPassword = GenDigestPwd(password);
      console.log(encryptPassword);
    } catch {
      return { resultCode: -1, data: null };
    }
  }

  // 서비스 로직

  async personalRegister(body: any): Promise<any> {
    const {
      email,
      password,
      phone,
      residentNumber,
      businessOption,
      bankName,
      bankAccount,
      depositor,
      name,
      instagram,
      twitter,
    } = body;
    const query = getRepository(Seller).createQueryBuilder('s');
    query.select('MAX(s.id)', 'max');
    const maxSeller = await query.getRawOne();
    const hashedPassword = GenDigestPwd(password);
    const encryptPhoneNumber = await this.encryptPhone(phone);
    const encryptAccountNumber = await this.encryptBankAccount(bankAccount);
    const encryptedResidentNumber = await this.encryptResidentNumber(
      residentNumber,
    );
    const seller = getRepository(Seller).create();
    // 가장 큰 숫자의 작가 번호 + 1로 할당
    seller.id = maxSeller.max + 1;
    seller.email = email;
    seller.password = hashedPassword;
    seller.phone =
      typeof encryptPhoneNumber === 'string' ? encryptPhoneNumber : '';
    await getRepository(Seller).save(seller);

    const sellerInfo = getRepository(SellerInfo).create();
    sellerInfo.sellerType = SellerType.normal;
    sellerInfo.businessOption = businessOption;
    sellerInfo.residentNumber =
      typeof encryptedResidentNumber === 'string'
        ? encryptedResidentNumber
        : '';

    let koreanCheck = true;
    let check = 0;

    // 주민등록번호 검증
    if (
      parseInt(residentNumber.charAt(6)) > 4 &&
      parseInt(residentNumber.charAt(6)) < 9
    ) {
      koreanCheck = false;
      return { resultCode: 6004, data: null };
    }

    for (let i = 0; i < 12; i++) {
      check += ((i % 8) + 2) * parseInt(residentNumber.charAt(i));
    }

    check = 11 - (check % 11);
    check %= 10;
    let resNum = Number(residentNumber.charAt(12));

    // 잘못된 주민등록번호
    if (check !== resNum) {
      return { resultCode: 6005, data: null };
    }

    const sellerPopbillAccount = getRepository(SellerPopbillAccount).create();
    sellerPopbillAccount.representativeName = null;
    sellerPopbillAccount.popbillId = null;
    sellerPopbillAccount.seller = seller;
    sellerInfo.name = name;
    sellerInfo.bankName = bankName;
    sellerInfo.bankAccount =
      typeof encryptAccountNumber === 'string' ? encryptAccountNumber : '';
    sellerInfo.depositor = depositor;
    sellerInfo.instagram = instagram;
    sellerInfo.twitter = twitter;
    sellerInfo.seller = seller;

    await getRepository(SellerInfo).save(sellerInfo);
    await getRepository(SellerPopbillAccount).save(sellerPopbillAccount);

    const temp = getRepository(TemporaryProduct).create();
    temp.id = seller.id;
    temp.seller = seller;
    await getRepository(TemporaryProduct).save(temp);
  }

  async businessRegister(body: any): Promise<any> {
    const {
      email,
      password,
      phone,
      businessOption,
      bankName,
      bankAccount,
      depositor,
      name,
      representativeName,
      businessName,
      businessNumber,
      instagram,
      twitter,
    } = body;
    const query = getRepository(Seller).createQueryBuilder('s');
    query.select('MAX(s.id)', 'max');
    const maxSeller = await query.getRawOne();
    const hashedPassword = GenDigestPwd(password);
    const encryptPhoneNumber = await this.encryptPhone(phone);
    const encryptAccountNumber = await this.encryptBankAccount(bankAccount);
    const seller = getRepository(Seller).create();
    seller.id = maxSeller.max + 1;
    seller.email = email;
    seller.password = hashedPassword;
    seller.phone =
      typeof encryptPhoneNumber === 'string' ? encryptPhoneNumber : '';
    await getRepository(Seller).save(seller);

    const sellerInfo = getRepository(SellerInfo).create();
    sellerInfo.sellerType = SellerType.corporate;
    sellerInfo.businessOption = businessOption;
    sellerInfo.residentNumber = null;

    const sellerPopbillAccount = getRepository(SellerPopbillAccount).create();
    sellerPopbillAccount.popbillId = null;
    sellerPopbillAccount.managerName = name;
    sellerPopbillAccount.representativeName = representativeName;
    sellerPopbillAccount.businessName = businessName;
    sellerPopbillAccount.seller = seller;
    sellerInfo.name = sellerPopbillAccount.managerName;
    sellerInfo.businessNumber = businessNumber;

    let popbillCheck = await this.checkPopbillMember(businessNumber);

    // 팝빌 회원
    if (popbillCheck.data.result.code == 1) {
      sellerInfo.popbillChecked = true;
    }

    // 팝빌 비회원
    else {
      sellerInfo.popbillChecked = false;
    }

    sellerInfo.bankName = bankName;
    sellerInfo.bankAccount =
      typeof encryptAccountNumber === 'string' ? encryptAccountNumber : '';
    sellerInfo.depositor = depositor;
    sellerInfo.instagram = instagram;
    sellerInfo.twitter = twitter;
    sellerInfo.seller = seller;

    await getRepository(SellerInfo).save(sellerInfo);
    await getRepository(SellerPopbillAccount).save(sellerPopbillAccount);

    const temp = getRepository(TemporaryProduct).create();
    temp.id = seller.id;
    temp.seller = seller;
    await getRepository(TemporaryProduct).save(temp);
  }

  async createLedgerData() {
    const query = getRepository(Seller).createQueryBuilder('s');
    query.select('MAX(s.id)', 'max');
    const maxSeller = await query.getRawOne();
    const sellerId = maxSeller.max;
    const seller = await this.getSeller(sellerId);
    const sellerInfo = await this.getSellerInfo(sellerId);
    const createdAt = new Date(seller.createdAt);
    const saleYear = createdAt.getFullYear().toString();
    const saleMonth = (createdAt.getMonth() + 2).toString();
    const sellerLedger = getRepository(SellerLedger).create();
    sellerLedger.saleYear = saleYear;
    sellerLedger.saleMonth = saleMonth;
    sellerLedger.seller = seller;
    sellerLedger.feeRatio = sellerInfo.feeRatio;
    sellerLedger.ledgerStatus = LedgerStatus.sale;

    // 국내 셀러
    if (seller.registType == true) {
      sellerLedger.currency = Currency.KRW;
    }

    // 해외 셀러
    else {
      sellerLedger.currency = Currency.USD;
    }

    await getRepository(SellerLedger).save(sellerLedger);
  }

  async englishRegister(body: any): Promise<any> {
    const {
      email,
      password,
      name,
      countryCode,
      phone,
      ledgerType,
      ledgerEmail,
      residentNumber,
    } = body;
    const hashedPassword = GenDigestPwd(password);
    const query = getRepository(Seller).createQueryBuilder('s');
    query.select('MAX(s.id)', 'max');
    const maxSeller = await query.getRawOne();
    let rawPhone = null;
    let encryptPhone = null;

    const seller = getRepository(Seller).create();
    // 가장 큰 숫자의 작가 번호 + 1로 할당
    seller.id = maxSeller.max + 1;
    seller.email = email;
    seller.password = hashedPassword;
    seller.registType = false;

    // 국가 코드 조회
    let rawCountryData = fs.readFileSync(
      __dirname + '/../../' + 'country.json',
    );
    const countryData = JSON.parse(rawCountryData.toString());
    let countryNum = null;

    for (let i = 0; i < countryData.length; i++) {
      if (countryCode === countryData[i].country_no) {
        seller.nationality = countryData[i].country_name;
        countryNum = countryData[i].country_no;
      }
    }

    rawPhone = countryNum + ' ' + phone;
    encryptPhone = await this.encryptPhone(rawPhone);
    seller.phone = typeof encryptPhone === 'string' ? encryptPhone : '';
    await getRepository(Seller).save(seller);

    const sellerInfo = getRepository(SellerInfo).create();
    sellerInfo.name = name;
    sellerInfo.ledgerType = ledgerType;
    sellerInfo.ledgerEmail = ledgerEmail;
    sellerInfo.residentNumber = residentNumber;
    sellerInfo.seller = seller;
    await getRepository(SellerInfo).save(sellerInfo);

    const sellerPopbillAccount = getRepository(SellerPopbillAccount).create();
    sellerPopbillAccount.seller = seller;
    await getRepository(SellerPopbillAccount).save(sellerPopbillAccount);

    const temp = getRepository(TemporaryProduct).create();
    temp.id = seller.id;
    temp.seller = seller;
    await getRepository(TemporaryProduct).save(temp);
  }

  async addSellerInfo(files: File[], body: any): Promise<any> {
    const {
      sellerId,
      brandName,
      englishBrandName,
      brandStory,
      englishBrandStory,
      hashTag,
      instagram,
      twitter,
    } = body;
    const seller = await this.getSeller(sellerId);
    const sellerInfo = await this.getSellerInfo(sellerId);

    // 미성년자 셀러
    if (sellerInfo.sellerType === SellerType.underage) {
      const sellerMinor = getRepository(SellerMinorFile).create();
      sellerMinor.certificateOriginalName =
        files['legalRepresentCertificate'][0].key;
      sellerMinor.certificatePath = cloudfrontPath(
        files['legalRepresentCertificate'][0].key,
      );
      sellerMinor.legalRepresentOriginalName = files['legalRepresent'][0].key;
      sellerMinor.legalRepresentPath = cloudfrontPath(
        files['legalRepresent'][0].key,
      );
      sellerMinor.familyOriginalName = files['family'][0].key;
      sellerMinor.familyPath = cloudfrontPath(files['family'][0].key);
      sellerMinor.seller = seller;
      await getRepository(SellerMinorFile).save(sellerMinor);
    }

    // 법인 사업자 셀러
    else if (sellerInfo.sellerType == SellerType.corporate) {
      const sellerFile = getRepository(SellerFile).create();
      sellerFile.seller = seller;
      await getRepository(SellerFile).save(sellerFile);
    }

    seller.status = SellerStatus.registered;
    await getRepository(Seller).save(seller);

    // 해시태그 삭제
    await getRepository(SellerHashTag)
      .createQueryBuilder('sht')
      .delete()
      .from(SellerHashTag)
      .where('sellerId = :sellerId', { sellerId: sellerId })
      .execute();

    // 해시태그 입력
    if (hashTag) {
      // 해시태그 입력(다수)
      if (Array.isArray(hashTag)) {
        hashTag.forEach(async (o) => {
          let productHashTag = getRepository(SellerHashTag).create();
          productHashTag.name = o;
          productHashTag.seller = seller;
          await getRepository(SellerHashTag).save(productHashTag);
        });
      }
      // 해시태그 입력(단일)
      else {
        let productHashTag = getRepository(SellerHashTag).create();
        productHashTag.name = hashTag;
        productHashTag.seller = seller;
        await getRepository(SellerHashTag).save(productHashTag);
      }
    }
    // 인스타그램, 트위터
    if (instagram) {
      sellerInfo.instagram = instagram;
    } else {
      sellerInfo.instagram = null;
    }
    if (twitter) {
      sellerInfo.twitter = twitter;
    } else {
      sellerInfo.twitter = null;
    }
    // 프로필 이미지 업로드
    if (files['profile']) {
      sellerInfo.brandImage = cloudfrontPath(files['profile'][0].key);
    }
    // 프로필 배경 이미지 업로드
    if (files['backProfile']) {
      sellerInfo.brandBackgroundImage = cloudfrontPath(
        files['backProfile'][0].key,
      );
    }
    sellerInfo.brandName = brandName;
    sellerInfo.englishBrandName = englishBrandName;
    sellerInfo.brandStory = brandStory;
    sellerInfo.englishBrandStory = englishBrandStory;
    await getRepository(SellerInfo).save(sellerInfo);
  }

  async addEnglishSellerInfo(
    files: File[],
    body: AddInfoEnglishSellerReqDto,
  ): Promise<any> {
    const {
      sellerId,
      englishBrandName,
      englishBrandStory,
      hashTag,
      instagram,
      twitter,
    } = body;
    const seller = await this.getSeller(sellerId);
    const sellerInfo = await this.getSellerInfo(sellerId);
    seller.status = SellerStatus.registered;
    await getRepository(SellerInfo).save(seller);

    // 해시태그 삭제
    await getRepository(SellerHashTag)
      .createQueryBuilder('sht')
      .delete()
      .from(SellerHashTag)
      .where('sellerId = :sellerId', { sellerId: sellerId })
      .execute();

    // 해시태그 입력
    if (hashTag) {
      // 해시태그 입력(다수)
      if (Array.isArray(hashTag)) {
        hashTag.forEach(async (o) => {
          let productHashTag = getRepository(SellerHashTag).create();
          productHashTag.name = o;
          productHashTag.seller = seller;
          await getRepository(SellerHashTag).save(productHashTag);
        });
      }
      // 해시태그 입력(단일)
      else {
        let productHashTag = getRepository(SellerHashTag).create();
        productHashTag.name = hashTag;
        productHashTag.seller = seller;
        await getRepository(SellerHashTag).save(productHashTag);
      }
    }

    // 인스타그램, 트위터
    if (instagram) {
      sellerInfo.instagram = instagram;
    } else {
      sellerInfo.instagram = null;
    }
    if (twitter) {
      sellerInfo.twitter = twitter;
    } else {
      sellerInfo.twitter = null;
    }

    sellerInfo.brandImage = cloudfrontPath(files['profile'][0].key);
    sellerInfo.brandName = englishBrandName;
    sellerInfo.englishBrandName = englishBrandName;
    sellerInfo.brandStory = englishBrandStory;
    sellerInfo.englishBrandStory = englishBrandStory;
    await getRepository(SellerInfo).save(sellerInfo);
  }

  async checkPopbillMember(body: any) {
    const popbill = require('popbill');
    popbill.config({
      LinkID: 'NOUTECOMPANY',
      SecretKey: 'GtxNHprG4JZfiCYQHxYOzK7VJ7TIA/JV+3feCKyOx0I=',
      IsTest: false,
      IPRestrictOnOff: true,
      UseLocalTimeYN: true,
      UseStaticIP: false,
      defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
      },
    });
    try {
      // 팝빌 회원 여부 확인
      const accountCheckService = popbill.AccountCheckService();
      let data = null;
      let corpNum = body;
      return new Promise((resolve, reject) => {
        accountCheckService.checkIsMember(
          corpNum,
          function (result) {
            data = {
              result: result,
            };
            resolve(data);
          },
          function (Error) {
            data = {
              result: Error,
            };
            reject(Error);
          },
        );
      }).then((res) => {
        return { resultCode: 1, data: data };
      });
    } catch (err) {
      console.log(err);
      return { resultCode: -1, data: null };
    }
  }

  async getLedgerList(req: any, body: any): Promise<any> {
    const sellerId = req.seller.sellerId;
    const seller = await this.getSeller(sellerId);
    let data = null;
    let sellerLedgerInfo = null;

    if (seller.registType === true) {
      sellerLedgerInfo = await this.getSellerLedgerData(sellerId);
    } else {
      sellerLedgerInfo = await this.getSellerEnglishLedgerData(sellerId);
    }

    let ledgerData = [];

    for (let i = 0; i < sellerLedgerInfo.length; i++) {
      let saleYear = null;
      let saleMonth = null;

      // 정산월이 1월일 경우(내년으로 넘어감)
      if (sellerLedgerInfo[i].saleMonth === '01') {
        saleYear = Number(sellerLedgerInfo[i].saleYear) - 1;
        saleMonth = 12;
        saleYear = String(saleYear);
        saleMonth = String(saleMonth);
      }
      // 정산월이 1월이 아닐 경우
      else {
        saleYear = sellerLedgerInfo[i].saleYear;
        saleMonth = Number(sellerLedgerInfo[i].saleMonth) - 1;
        saleMonth = String(saleMonth);
      }
      // 정산 상태가 판매중일 경우
      if (sellerLedgerInfo[i].ledgerStatus === LedgerStatus.sale) {
        ledgerData[i] = {
          saleYear: saleYear,
          saleMonth: saleMonth,
          ledgerYear: sellerLedgerInfo[i].saleYear,
          ledgerMonth: sellerLedgerInfo[i].saleMonth,
          saleAmount: sellerLedgerInfo[i].saleAmount,
          ledgerAmount: '-',
          ledgerStatus: sellerLedgerInfo[i].ledgerStatus,
        };
      }
      // 정산 상태가 판매중이 아닐 경우
      else {
        ledgerData[i] = {
          saleYear: saleYear,
          saleMonth: saleMonth,
          ledgerYear: sellerLedgerInfo[i].saleYear,
          ledgerMonth: sellerLedgerInfo[i].saleMonth,
          saleAmount: sellerLedgerInfo[i].saleAmount,
          ledgerAmount: sellerLedgerInfo[i].ledgerAmount,
          ledgerStatus: sellerLedgerInfo[i].ledgerStatus,
        };
      }
    }

    let count = ledgerData.length;
    const offset = (body + 1) * 4;
    let resData = ledgerData.reverse();
    resData = ledgerData.slice(body * 4, offset);

    data = {
      resData,
      count,
    };

    return data;
  }

  async getLedgerExcelData(req: any): Promise<any> {
    const sellerId = req.seller.sellerId;
    console.log(sellerId);
    const query = await this.getSellerConfirmedLedgerData(sellerId);
    let data = [];
    let res = {};

    for (let i = 0; i < query.length; i++) {
      let saleYear = null;
      let saleMonth = null;

      // 정산월이 1월일 경우(내년으로 넘어감)
      if (query[i].saleMonth === '01') {
        saleYear = Number(query[i].saleYear) - 1;
        saleMonth = 12;
        saleYear = String(saleYear);
        saleMonth = String(saleMonth);
      }
      // 정산월이 1월이 아닐 경우
      else {
        saleYear = query[i].saleYear;
        saleMonth = Number(query[i].saleMonth) - 1;
        saleMonth = String(saleMonth);
      }

      data[i] = {
        saleYear: saleYear,
        saleMonth: saleMonth,
        ledgerYear: query[i].saleYear,
        ledgerMonth: query[i].saleMonth,
        ledgerAmount: query[i].ledgerAmount,
        ledgerStatus: query[i].ledgerStatus,
      };

      res = data[i];
    }

    return res;
  }
}
