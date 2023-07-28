import request from 'supertest';
import { app } from '../../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      firstName: 'test',
      lastName: 'test',
    })
    .expect(201);

  const res = await request(app).post('/api/auth/signout').send({}).expect(200);

  expect(res.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
