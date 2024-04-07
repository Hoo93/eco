export class MockJwtService {
  public async sign(payload: any, options) {
    return 'token';
  }

  public verify(token: string): any {
    return;
  }
}
