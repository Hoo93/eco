import { Pagination } from '../src/common/pagination';

describe('Pagination', () => {
  let pagination: TestPagination;

  beforeEach(() => {
    pagination = new TestPagination();
  });

  it('pageNo, pageSize는 각각 디폴트 값으로 0과 10을 가진다', () => {
    expect(pagination.pageNo).toBe(0);
    expect(pagination.pageSize).toBe(10);
  });

  describe.each([
    { pageNo: 1, pageSize: 10, expectedOffset: 0 },
    { pageNo: 2, pageSize: 10, expectedOffset: 10 },
    { pageNo: 3, pageSize: 5, expectedOffset: 10 },
    // 추가적인 시나리오를 이 배열에 추가할 수 있습니다.
  ])('getOffset with pageNo: $pageNo and pageSize: $pageSize', ({ pageNo, pageSize, expectedOffset }) => {
    it(`should return offset: ${expectedOffset}`, () => {
      pagination.pageNo = pageNo;
      pagination.pageSize = pageSize;
      expect(pagination.getOffset()).toBe(expectedOffset);
    });
  });

  describe.each([
    { pageSize: 10, expectedLimit: 10 },
    { pageSize: 5, expectedLimit: 5 },
    { pageSize: 20, expectedLimit: 20 },
    // 추가적인 시나리오를 이 배열에 추가할 수 있습니다.
  ])('getLimit with pageSize: $pageSize', ({ pageSize, expectedLimit }) => {
    it(`should return limit: ${expectedLimit}`, () => {
      pagination.pageSize = pageSize;
      expect(pagination.getLimit()).toBe(expectedLimit);
    });
  });

  // 유효성 검사와 관련된 테스트 등 추가적인 테스트 케이스를 여기에 구현할 수 있습니다.
});

class TestPagination extends Pagination {}
