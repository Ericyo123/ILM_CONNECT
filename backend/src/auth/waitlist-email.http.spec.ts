import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request = require('supertest');
import { Resend } from 'resend';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const send = jest.fn();
jest.mock('resend', () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));

describe('Public form to email HTTP flow', () => {
  let app: INestApplication;
  const originalEnv = process.env;
  const payload = {
    fullName: 'Trial Student', email: 'student@example.test', phone: '+94771234567',
    country: 'Sri Lanka', course: 'Noorani Qaida', pace: 'standard', notes: 'Weekend mornings',
  };
  const entry = { ...payload, id: 'request-id', createdAt: new Date('2026-11-02T10:00:00Z') };
  const prisma = { waitlistEntry: { createMany: jest.fn(), findUniqueOrThrow: jest.fn() } };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, { provide: PrismaService, useValue: prisma }, { provide: JwtService, useValue: {} }],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'Ilmbit <notifications@example.test>', WAITLIST_NOTIFICATION_EMAIL: 'contact@bitmosolutions.com' };
    (Resend as unknown as jest.Mock).mockImplementation(() => ({ emails: { send } }));
    prisma.waitlistEntry.createMany.mockResolvedValue({ count: 1 });
    prisma.waitlistEntry.findUniqueOrThrow.mockResolvedValue(entry);
    send.mockResolvedValue({ data: { id: 'email-id' }, error: null });
  });
  afterAll(async () => { process.env = originalEnv; await app.close(); });

  it('accepts the unchanged public form payload and emails the configured team inbox', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/waitlist').send(payload).expect(201);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ['contact@bitmosolutions.com'], replyTo: payload.email, text: expect.stringContaining(payload.notes) }), { idempotencyKey: 'waitlist/request-id' });
  });

  it('rejects an invalid sender email before storing or forwarding a request', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/waitlist').send({ ...payload, email: 'invalid' }).expect(400);
    expect(prisma.waitlistEntry.createMany).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('returns a recoverable error when email delivery fails and retries the saved request', async () => {
    send.mockResolvedValueOnce({ data: null, error: { message: 'Provider unavailable' } });
    const failed = await request(app.getHttpServer()).post('/api/v1/auth/waitlist').send(payload).expect(503);
    expect(failed.body.message).toContain('Your request is saved');
    prisma.waitlistEntry.createMany.mockResolvedValue({ count: 0 });
    await request(app.getHttpServer()).post('/api/v1/auth/waitlist').send(payload).expect(201);
    expect(send.mock.calls[1]).toEqual(send.mock.calls[0]);
  });

  it('does not let public submissions choose the notification recipient', async () => {
    await request(app.getHttpServer()).post('/api/v1/auth/waitlist').send({ ...payload, to: 'someone@example.test' }).expect(400);
    expect(send).not.toHaveBeenCalled();
  });
});
