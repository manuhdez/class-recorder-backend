import supertest from 'supertest';
import { getTestableRoute, connectDB, disconnectTestDB } from 'test/test-utils';
import User from '../../models/user';
import authRouter from './auth';

const baseUrl = '/auth';
const route = getTestableRoute(baseUrl, authRouter);
const api = supertest(route);

describe('auth router', () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await disconnectTestDB();
  });

  describe('POST - /signup', () => {
    const mockUser = {
      email: 'mock@mail.com',
      username: 'mockUsername',
      password: 'mockPassword',
    };

    test('user cannot register with invalid email', async () => {
      await api
        .post(`${baseUrl}/signup`)
        .send({
          email: 'helloworld',
          username: 'username',
          password: 'password',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Please enter a valid email address.' });
    });

    test('user cannot register with missing data', async () => {
      await api
        .post(`${baseUrl}/signup`)
        .send({ email: 'email@test.com', password: 'pass' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Please enter a valid username with at least 3 characters.',
        });

      await api
        .post(`${baseUrl}/signup`)
        .send({ username: 'com', password: 'pass' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Please enter a valid email address.',
        });

      await api
        .post(`${baseUrl}/signup`)
        .send({ email: 'email@test.com', username: 'pass' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({
          error: 'Password must be between 4 and 20 characters long.',
        });
    });

    test('user with valid data can register successfully', async () => {
      const apiResponse = await api
        .post(`${baseUrl}/signup`)
        .send({ ...mockUser })
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
      await api
        .post(`${baseUrl}/signup`)
        .send({ ...mockUser, username: 'other_username' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Email is already in use' });
    });

    test('user cannot register with a repeated username', async () => {
      await api
        .post(`${baseUrl}/signup`)
        .send({ ...mockUser, email: 'other@email.com' })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .expect({ error: 'Username is already in use' });
    });
  });

  describe('GET - /login', () => {
    test('/login to be an accesible route', async () => {
      await api
        .get(`${baseUrl}/login`)
        .expect(200)
        .expect('user authenticated successfully');
    });
  });
});
