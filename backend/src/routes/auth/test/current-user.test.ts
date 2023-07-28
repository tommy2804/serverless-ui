import request from 'supertest';
import { app } from '../../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get('/api/auth/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(res.body.currentUser.email).toEqual('test@test.com');
  console.log(res.body.currentUser);
});

it('responds with null if not authenticated', async () => {
  const res = await request(app).get('/api/auth/currentuser').send({}).expect(200);
  expect(res.body.currentUser).toBeNull();
});
