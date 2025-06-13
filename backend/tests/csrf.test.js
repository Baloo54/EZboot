import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

// Middleware CSRF
const csrfProtection = csrf({ cookie: true });

const sendCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

// Crée une app Express pour test
const app = express();
app.use(cookieParser());
app.use(express.json());

// Route pour obtenir le jeton CSRF
app.get('/api/csrf-token', csrfProtection, sendCsrfToken);

// Route protégée CSRF à des fins de test
app.post('/api/test-csrf', csrfProtection, (req, res) => {
  res.json({ success: true });
});

describe('CSRF Middleware', () => {
  let csrfToken;
  let cookie;

  it('doit retourner un token CSRF et le cookie associé', async () => {
    const res = await request(app).get('/api/csrf-token');

    expect(res.statusCode).toBe(200);
    expect(res.body.csrfToken).toBeDefined();

    csrfToken = res.body.csrfToken;
    cookie = res.headers['set-cookie'].find(c => c.startsWith('csrfToken') || c.includes('XSRF-TOKEN') || c.includes('csrf'));

    expect(cookie).toBeDefined();
  });

  it('doit accepter une requête POST protégée si le token CSRF est valide', async () => {
    const res = await request(app)
      .post('/api/test-csrf')
      .set('Cookie', cookie)
      .set('csrf-token', csrfToken) // ou 'x-csrf-token' selon ta config
      .send({ data: 'valeur' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('doit rejeter une requête POST sans token CSRF', async () => {
    const res = await request(app)
      .post('/api/test-csrf')
      .send({ data: 'valeur' });

    expect(res.statusCode).toBe(403);
  });
});
