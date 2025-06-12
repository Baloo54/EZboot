import request from 'supertest';
import app from '../src/app/App.js'; 

describe('Test des routes API', () => {
  test('GET /api/hello doit retourner un message Hello world!', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello world!' });
  });
});
