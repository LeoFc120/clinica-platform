import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clinica Platform Backend is running' });
});

describe('GET /api/health', () => {
  it('debería responder con un estado 200 y mensaje de OK', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});