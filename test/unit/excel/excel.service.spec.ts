import { ExcelService } from '../../../src/common/excel.service';
import * as XLSX from 'xlsx';

describe('ExcelService Test', () => {
  let excelService: ExcelService;

  beforeEach(() => {
    excelService = new ExcelService();
  });

  describe('extractDataFromExcel Test', () => {
    it('excel에서 data를 추출해 excel header와 DB column을 매핑한 객체를 반환한다.', () => {
      // Given
      const workBook = XLSX.utils.book_new();
      const worksheetName = 'Test Work Sheet';
      const data = [
        ['header_1', 'header_2'],
        ['row_1Col_1', 'row_1Col_2'],
        ['row_2Col_1', 'row_2Col_2'],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workBook, worksheet, worksheetName);
      const fileBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });

      const headerToDbMapper = { header_1: 'dbField_1', header_2: 'dbField_2' };

      // When
      const result = excelService.extractDataFromExcel(fileBuffer, headerToDbMapper);

      // Then
      expect(result).toEqual([
        { dbField_1: 'row_1Col_1', dbField_2: 'row_1Col_2' },
        { dbField_1: 'row_2Col_1', dbField_2: 'row_2Col_2' },
      ]);
    });
  });

  describe('exportDataToExcel Test', () => {
    it('DB에서 조회한 데이터를 db column과 excel header를 매핑해 Excel로 추출한다.', () => {
      // Given
      const dataFromDb = [
        { dbField_1: 'row_1Col_1', dbField_2: 'row_1Col_2' },
        { dbField_1: 'row_2Col_1', dbField_2: 'row_2Col_2' },
      ];

      const dbToHeaderMapper = { dbField_1: 'header_1', dbField_2: 'header_2' };

      // When
      const fileBuffer = excelService.exportDataToExcel(dataFromDb, dbToHeaderMapper);

      const headerToDbMapper = { header_1: 'dbField_1', header_2: 'dbField_2' };
      const result = excelService.extractDataFromExcel(fileBuffer, headerToDbMapper);

      // Then
      expect(result).toEqual([
        { dbField_1: 'row_1Col_1', dbField_2: 'row_1Col_2' },
        { dbField_1: 'row_2Col_1', dbField_2: 'row_2Col_2' },
      ]);
    });
  });
});
