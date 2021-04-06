import supertest from 'supertest';
import { getTestableRoute } from 'test/test-utils';
import screenshotRouter from './screenshot';
import { ValidationMsg } from '../../../types/validation';

const baseUrl = '/scraper/screenshot';
const route = getTestableRoute(baseUrl, screenshotRouter);
const api = supertest(route);

describe('/scraper/screenshot', () => {
  test('user receives an image with a screenshot of the url received', async () => {
    const body = { url: 'https://google.es' };

    await api
      .post(`${baseUrl}/`)
      .send(body)
      .expect(200)
      .expect('Content-Type', /jpeg/);
  });

  test('returns a warning if no url is received', async () => {
    await api
      .post(`${baseUrl}/`)
      .expect(500)
      .expect('Content-Type', /application\/json/)
      .expect({ error: ValidationMsg.invalidUrl });
  });
});
