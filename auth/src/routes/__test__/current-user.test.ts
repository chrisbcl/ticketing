import request from 'supertest';
import { app } from '../../app';
import { signUp } from '../../test/utils';

it('responds with details about current user', async () => {
    const cookie = await signUp();

    const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(400);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send().expect(200);

    expect(response.body.currentUser).toEqual(null);
});
