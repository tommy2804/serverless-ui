import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { ROLE } from '../types/role';

declare global {
  var signin: () => Promise<string[]>;
  var signInUser: () => Promise<string[]>;
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/auth/signup')
    .send({ email, password, firstName: 'test', lastName: 'test' })
    .expect(201);
  const cookie = response.get('Set-Cookie');

  return cookie;
};

global.signInUser = async () => {
  const emailAdmin = 'testadmin@test.com';
  const passwordAdmin = 'password';

  // create admin user with role

  const resAdmin = await request(app)
    .post('/api/auth/signup')
    .send({ email: emailAdmin, password: passwordAdmin, firstName: 'test', lastName: 'test' })
    .expect(201);
  const cookieAdmin = resAdmin.get('Set-Cookie');

  // create a user from admin
  await request(app)
    .post('/api/users')
    .set('Cookie', cookieAdmin)
    .send({
      email: 'envkt@example.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(201);

  // signin to get cookie to header
  const signUserRes = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'envkt@example.com',
      password: '12342',
    })
    .expect(201);

  const cookie = signUserRes.get('Set-Cookie');

  return cookie;
};

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = '__jsonwebtokenkey__';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
