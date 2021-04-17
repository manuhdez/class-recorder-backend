import supertest from 'supertest';
import {
  connectDB,
  disconnectTestDB,
  getMockTocken,
  getTestableRoute,
} from 'test/test-utils';
import streamRouter from './stream';
import { mockRecordings } from './mocks/recordings';
import RecordRepository from 'context/Record/RecordRepository';
import UserModel from 'models/user';
import { Record } from 'types/record';
import authRouter from 'router/auth/auth';
import RecordModel from 'models/record';

const baseUrl = '/scraper/screenshot';
const route = getTestableRoute(baseUrl, streamRouter);
const api = supertest(route);

async function dumpDB(): Promise<void> {
  await UserModel.deleteMany();
  await RecordModel.deleteMany();
}

async function createTestUser(): Promise<void> {
  const newUserData = {
    username: 'test user',
    email: 'test@email.com',
    password: 'testpassword',
  };

  const userRoute = getTestableRoute('/auth', authRouter);
  const userApi = supertest(userRoute);
  await userApi.post('/auth/signup').send(newUserData);
}

async function createRecordsForTestUser(userId: string, mocks: Record[]) {
  const recordRepository = new RecordRepository();

  for (const mock of mocks) {
    await recordRepository.createRecord({
      ...mock,
      owner: userId,
    });
  }
}

describe('/scraper/stream', () => {
  let token: string;
  beforeAll(async () => {
    await connectDB();
    await dumpDB();
    await createTestUser();
    const testUser = await UserModel.findOne({});
    await createRecordsForTestUser(testUser?.id, mockRecordings);
    token = getMockTocken({
      id: testUser?.id as string,
      username: testUser?.username as string,
    });
  });

  afterAll(async () => {
    disconnectTestDB();
  });

  test('GET - /', async () => {
    await api
      .get(`${baseUrl}/`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(({ body: { data } }) => {
        expect(data).toHaveLength(mockRecordings.length);
        expect(data[0].title).toEqual(mockRecordings[0].title);
      });
  });
});
