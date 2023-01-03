import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Category } from './entity/Category.entity';
import { TemplateColumn } from './entity/TemplateColumn.entity';

@Injectable()
export class AppService {
  async test(body: any) {
    const { test } = body;
    console.log(test);
    let data = test;
    return data;
  }

  async getProductTemplateList(): Promise<any> {
    let status = 0;
    let resultCode = 0;
    let templateList = Array();
    let categoryList = await getRepository(Category)
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.row', 'r')
      .where('c.parentId is null')
      .getMany();
    for (let i = 0; i < categoryList.length; i++) {
      let categoryId = categoryList[i].id;
      let rowList = categoryList[i].row;
      templateList.push({ categoryId: categoryId });
      let rowNameList = Array();
      for (let j = 0; j < rowList.length; j++) {
        let rowName = rowList[j].name;
        let enRowName = rowList[j].englishName;
        let rowId = rowList[j].id;
        let columnNameList = Array();
        rowNameList.push({
          rowId: rowId,
          rowName: rowName,
          enRowName: enRowName,
        });
        let columnList = await getRepository(TemplateColumn)
          .createQueryBuilder('tc')
          .leftJoinAndSelect('tc.row', 'tr')
          .where('tr.id = :rowId', { rowId: rowId })
          .getMany();
        for (let k = 0; k < columnList.length; k++) {
          let columnId = columnList[k].id;
          let columnName = columnList[k].name;
          let enColumnName = columnList[k].englishName;
          columnNameList.push({
            columnId: columnId,
            columnName: columnName,
            enColumnName: enColumnName,
          });
        }
        rowNameList[j] = { ...rowNameList[j], columnNameList };
      }
      templateList[i] = { ...templateList[i], rowNameList };
    }
    status = 200;
    resultCode = 1;
    return templateList;
  }
}
