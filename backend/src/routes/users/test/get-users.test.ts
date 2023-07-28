import request from 'supertest';
import { app } from '../../../app';

it('gets all users with a 201 status', async () => {
  const cookie = await global.signin();

  const createUserResponse = await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      email: 'envkt@example.com',
      password: '12342',
      firstName: 'jest',
      lastName: 'test',
    })
    .expect(201);

  const getUsersResponse = await request(app)
    .get('/api/users')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(getUsersResponse.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: createUserResponse.body.id,
        email: 'envkt@example.com',
        firstName: 'jest',
        lastName: 'test',
      }),
    ])
  );
});
