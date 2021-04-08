import Password from './Password';
import { ValidationMsg } from 'types/validation';

describe('Password', () => {
  test('generateHash', () => {
    const plainTextPassword = 'test-password';
    const hashedPassword = Password.generateHash(plainTextPassword);

    expect(plainTextPassword).not.toEqual(hashedPassword);
    expect(hashedPassword).toBeTruthy();
    expect(typeof hashedPassword).toEqual('string');
  });

  test('chechPassword', () => {
    const originalPassword = 'my-test-password';
    const hashedPassword = Password.generateHash(originalPassword);

    expect(() =>
      Password.verify(originalPassword, hashedPassword)
    ).not.toThrow();

    expect(() => Password.verify('fake-password', hashedPassword)).toThrowError(
      ValidationMsg.invalidLogin
    );
  });
});
