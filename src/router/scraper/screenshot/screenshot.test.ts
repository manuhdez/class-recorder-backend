import supertest from 'supertest';
import { getTestableRoute } from 'test/test-utils';
import screenshotRouter from './screenshot';

const baseUrl = '/scraper/screenshot';
const route = getTestableRoute(baseUrl, screenshotRouter);
const api = supertest(route);

describe('screenshot router', () => {
  test('GET - / to return a screenshot of the url received', async () => {
    await api
      .get(`${baseUrl}/`)
      .expect('Content-Type', /text\/html/)
      .expect(500);
  });
});
