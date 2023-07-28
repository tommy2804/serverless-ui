import request from 'supertest';
import { app } from '../../../app';

it('returns a 201 on successful user edit', async () => {
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
  
    const editUserResponse = await request(app)
      .put(`/api/users/${createUserResponse.body.id}`)
      .set('Cookie', cookie)
      .send({
        email: 'edited@test.com',
        password: 'newpassword',
        firstName: 'editedFirstName',
        lastName: 'LastName',
      })
      .expect(200);
  
    expect(editUserResponse.body.email).toEqual('edited@test.com');
    expect(editUserResponse.body.firstName).toEqual('editedFirstName');
  