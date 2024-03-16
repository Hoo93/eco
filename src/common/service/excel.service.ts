import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  extractDataFromExcel(fileBuffer: Buffer, headerToDbMapper: { [key: string]: string }) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: Array<any> = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 첫 행(열 이름)을 제외하고 데이터 처리
    const dataRows = jsonData.slice(1);
    const excelHeader = jsonData[0];
    const mappedData = dataRows.map((row) => {
      const rowObject = {};
      excelHeader.forEach((columnName, index) => {
        // columnMappings을 사용하여 Excel 열 이름을 DB 컬럼 이름으로 매핑
        const dbFieldName = headerToDbMapper[columnName];
        if (dbFieldName) {
          rowObject[dbFieldName] = row[index];
        }
      });
      return rowObject;
    });

    return mappedData;
  }

  exportDataToExcel(exportData: Array<any>, dbToHeaderMapper: { [key: string]: string }): Buffer {
    // 데이터베이스에서 조회한 데이터를 매핑 정보를 기반으로 변환
    const dataForExcel = exportData.map((member) => {
      const mappedData = {};
      Object.keys(dbToHeaderMapper).forEach((dbKey) => {
        const excelHeader = dbToHeaderMapper[dbKey];
        mappedData[excelHeader] = member[dbKey];
      });
      return mappedData;
    });

    // 첫 행에 사용할 이름 설정
    const excelHeaders = Object.values(dbToHeaderMapper); // 사용자 정의 열 이름 추출
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { header: excelHeaders });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

    // 파일을 메모리에서 직접 생성하여 Buffer로 반환
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return excelBuffer;
  }
}
