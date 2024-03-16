import { Member } from '../../../src/members/entities/member.entity';

describe('Member Entity Test', () => {
  it('hashPassword Test', async () => {
    const member = new Member();
    const password = 'testpassword';
    member.password = password;

    await member.hashPassword();
    expect(member.password).not.toBe(password);
  });
});
