import supertest from 'supertest';
import { getTestableRoute, connectDB, disconnectTestDB } from 'test/test-utils';
import User from 'models/user';
import authRouter from './auth';

const baseUrl = '/auth';
const route = getTestableRoute(baseUrl, authRouter);
const api = supertest(route);

const mockUser = {
  email: 'mock@mail.com',
  username: 'mockUsername',
  password: 'mockPassword',
};

describe('auth router', () => {
  const signupUrl = `${baseUrl}/signup`;
  const loginUrl = `${baseUrl}/login`;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe('POST - /signup', () => {
    beforeAll(async () => {
      await User.deleteMany({});
    });

    afterAll(async () => {
      await User.deleteMany({});
    });

    test('user cannot register with a bad formatted email', async () => {
      const body = {
        email: 'helloworld',
        username: 'username',
        password: 'password',
      };

      await api
        .post(signupUrl)
        .send(body)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Please enter a valid email address.' });
    });

    test('user cannot register with a missing data field', async () => {
      const bodyWithoutUsername = { email: 'email@test.com', password: 'pass' };
      await api
        .post(signupUrl)
        .send(bodyWithoutUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Please enter a valid username with at least 3 characters.',
        });

      const bodyWithoutEmail = { username: 'com', password: 'pass' };
      await api
        .post(signupUrl)
        .send(bodyWithoutEmail)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Please enter a valid email address.',
        });

      const bodyWithoutPassword = { email: 'email@test.com', username: 'pass' };
      await api
        .post(signupUrl)
        .send(bodyWithoutPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Password must be between 4 and 20 characters long.',
        });
    });

    test('user with valid data can register successfully', async () => {
      const apiResponse = await api
        .post(signupUrl)
        .send(mockUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const { user } = apiResponse.body;

      expect(user.email).toEqual(mockUser.email);
      expect(user.username).toEqual(mockUser.username);
      expect(user).toHaveProperty('id');
      expect(user).not.toHaveProperty('_id');
      expect(user).not.toHaveProperty('__v');
      expect(user).not.toHaveProperty('password');
    });

    test('the user password is hashed before saving the new user', async () => {
      const userFromDatabase = await User.findOne({ email: mockUser.email });
      expect(userFromDatabase).not.toBeNull();
      expect(userFromDatabase?.password).toBeTruthy();
      expect(userFromDatabase?.password).not.toBe(mockUser.password);
    });

    test('user cannot register with a repeated email', async () => {
      const body = { ...mockUser, username: 'other_username' };

      await api
        .post(signupUrl)
        .send(body)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Email is already in use.' });
    });

    test('user cannot register with a repeated username', async () => {
      const body = { ...mockUser, email: 'other@email.com' };

      await api
        .post(signupUrl)
        .send(body)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Username is already in use.' });
    });
  });

  describe('GET - /login', () => {
    beforeAll(async () => {
      //  create a base user to be able to login with
      await api.post(signupUrl).send(mockUser);
    });

    afterAll(async () => {
      await User.deleteMany({});
    });

    test('user can log in with valid email and password', async () => {
      const body = { email: mockUser.email, password: mockUser.password };
      const storedUser = await User.findOne({ email: mockUser.email });

      await api
        .post(loginUrl)
        .send(body)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(({ body }) => {
          expect(body).toHaveProperty('email', mockUser.email);
          expect(body).toHaveProperty('id', storedUser?.id);
          expect(body).toHaveProperty('token');
        });
    });

    test('user cannot log in with an invalid email', async () => {
      const body = { email: 'invalid email', password: 'some password' };

      await api
        .post(loginUrl)
        .send(body)
        .expect(400)
        .expect({ error: 'Please enter a valid email address.' });
    });

    test('user gets the same message if the password or email do not match', async () => {
      const bodyWithWrongEmail = {
        email: 'wrong@email.com',
        password: mockUser.password,
      };
      await api
        .post(loginUrl)
        .send(bodyWithWrongEmail)
        .expect(400)
        .expect({ error: 'Invalid email or password.' });

      const bodyWithWrongPassword = {
        email: mockUser.email,
        password: 'wrongpass',
      };
      await api
        .post(loginUrl)
        .send(bodyWithWrongPassword)
        .expect(400)
        .expect({ error: 'Invalid email or password.' });
    });

    test('user cannot log in with missing email or password field', async () => {
      const bodyWithoutEmail = { password: 'wrongpass' };
      await api
        .post(loginUrl)
        .send(bodyWithoutEmail)
        .expect(400)
        .expect({ error: 'Please enter a valid email address.' });

      const bodyWithoutPassword = { email: mockUser.email };
      await api
        .post(loginUrl)
        .send(bodyWithoutPassword)
        .expect(400)
        .expect({ error: 'Please enter a password with valid format.' });
    });
  });
});
