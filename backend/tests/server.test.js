const request = require('supertest');
const app = require('../server');

describe('Server Setup', () => {
  test('GET / should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Server running');
  });
});
