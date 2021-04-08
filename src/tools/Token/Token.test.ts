import Token from './Token';

describe('JWT', () => {
  let jwt: Token;
  beforeAll(() => {
    jwt = new Token();
  });

  const mockTokenData = {
    id: '1234567890',
    username: 'John Doe',
  };

  test('generateToken', () => {
    const generatedToken = jwt.generateToken(mockTokenData);
    const [header, payload, signature] = generatedToken.split('.');

    expect(header).toBeTruthy();
    expect(payload).toBeTruthy();
    expect(signature).toBeTruthy();
  });

  test('validateToken', () => {
    const generatedToken = jwt.generateToken(mockTokenData);
    const fakeToken = `${generatedToken}/fake`;

    expect(jwt.validateToken(generatedToken)).toEqual(true);
    expect(jwt.validateToken(fakeToken)).toEqual(false);
  });
});
