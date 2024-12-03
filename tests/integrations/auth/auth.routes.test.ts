import request from 'supertest';
import { app } from '../setup';
import httpStatus from 'http-status';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    const signupData = {
      name: "Test User",
      email: "test2@example.com",
      password: "password123",
      phone: "1234567890",
      address: "Test Address"
    };

    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email', signupData.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return error for duplicate email', async () => {
      // First signup
      await request(app)
        .post('/api/auth/signup')
        .send(signupData);

      // Try to signup with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(signupData);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user before testing login
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: "Test User",
          email: "test3@example.com",
          password: "password123",
          phone: "1234567890",
          address: "Test Address"
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "test3@example.com",
          password: "password123"
        });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "test3@example.com",
          password: "wrongpassword"
        });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is not correct !');
      expect(response.body.errorMessages).toEqual([
        {
          path: '',
          message: 'Password is not correct !'
        }
      ]);
      expect(response.body).not.toHaveProperty('token');
    });
  });
});