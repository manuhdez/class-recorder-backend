import supertest from 'supertest';
import { getTestableRoute } from 'test/test-utils';
import authRouter from './auth';

const baseUrl = '/auth';
const route = getTestableRoute(baseUrl, authRouter);
const api = supertest(route);

describe('auth router', () => {
  test('GET - /login to be an accesible route', async () => {
    await api
      .get(`${baseUrl}/login`)
      .expect(200)
      .expect('user authenticated successfully');
  });
});
