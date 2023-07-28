import request from 'supertest';
import { app } from '../../../app';

it('fails when a email that dows not exist is used', async () => {
  await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'envkt@example.com',
      password: '123456',
    })
    .expect(400);
});

it('fails when incorrect password is used', async () => {
  await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'envkt@example.com',
      password: '12345',
      firstName: 'envkt',
      lastName: 'envkt',
    })
    .expect(201);
  await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'envkt@example.com',
      password: '12342',
    })
    .expect(400);
});

it('response witn a cookie given a valid credentials', async () => {
  await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'envkt@example.com',
      password: '12345',
      firstName: 'envkt',
      lastName: 'envkt',
    })
    .expect(201);
  const res = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'envkt@example.com',
      password: '12345',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
