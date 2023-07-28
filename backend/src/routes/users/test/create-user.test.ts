import request from 'supertest';
import { app } from '../../../app';

it('return a 201 on successful creation of a new user', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      email: 'envkt@example.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(201);
});

it('returns a 401 for a not admin that trying to create user', async () => {
  const cookie = await global.signInUser();

  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      email: 'envkt@example.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(401);
});
