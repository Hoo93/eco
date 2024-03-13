import { User } from '../../../src/users/entities/user.entity';

describe('User Entity Test', () => {
  it('hashPassword Test', async () => {
    const user = new User();
    const password = 'testpassword';
    user.password = password;

    await user.hashPassword();
    expect(user.password).not.toBe(password);
  });
});
