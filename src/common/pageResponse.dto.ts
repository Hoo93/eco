export class PageResponseDto<T> {
  pageSize: number;
  count: number;
  totalPage: number;
  items: T[];

  constructor(pageSize: number, count: number, items: T[]) {
    this.pageSize = pageSize;
    this.count = count;
    this.totalPage = Math.floor((count + pageSize - 1) / pageSize);
    this.items = items;
  }
}
