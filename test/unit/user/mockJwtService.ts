export class MockJwtService {
  public async sign(payload: any, options) {
    return 'access_token';
  }
}
