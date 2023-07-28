import request from 'supertest';
import { app } from '../../../app';

it('return a 201 on successful to delete user', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      email: 'envkt@test.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(201);

  await request(app).delete(`/api/users/${res.body.id}`).set('Cookie', cookie).send().expect(201);
});

it('returns a 401 for a not admin that trying to delete user', async () => {
  const cookieAdmin = await global.signin();

  const res = await request(app)
    .post('/api/users')
    .set('Cookie', cookieAdmin)
    .send({
      email: 'envkt@test.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(201);

  const cookie = await global.signInUser();

  await request(app).delete(`/api/users/${res.body.id}`).set('Cookie', cookie).send().expect(401);
});
