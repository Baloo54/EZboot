const request = require('supertest');
const app = require('../src/app/App');

describe('Test des routes API', () => {
  test('GET /api/hello doit retourner un message Hello world!', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello world!' });
  });

  test('POST /api/echo doit renvoyer ce qui est envoyé', async () => {
    const data = { name: 'ChatGPT', age: 3 };
    const res = await request(app)
      .post('/api/echo')
      .send(data)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ youSent: data });
  });
});
