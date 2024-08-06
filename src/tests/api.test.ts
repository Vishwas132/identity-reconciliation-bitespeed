import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

import prisma from '../client.js';

beforeAll(async () => {
  await prisma.$connect();
  await prisma.$queryRaw`TRUNCATE TABLE "Contact" RESTART IDENTITY;`;
});

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE TABLE "Contact" RESTART IDENTITY;`;
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE TABLE "Contact" RESTART IDENTITY;`;
});

describe('POST /identify', () => {
  it('should return 400 if neither email nor phoneNumber is provided', async () => {
    const response = await request(app).post('/identify').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Either email or phoneNumber must be provided',
    });
  });

  it('should create a new primary contact when no existing contacts', async () => {
    const response = await request(app)
      .post('/identify')
      .send({ email: 'test@example.com', phoneNumber: '1234567890' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      contact: {
        primaryContactId: 1,
        emails: ['test@example.com'],
        phoneNumbers: ['1234567890'],
        secondaryContactIds: [],
      },
    });
  });

  it('should link a new secondary contact to an existing primary', async () => {
    // Create an initial primary contact
    await prisma.contact.create({
      data: {
        email: 'primary@example.com',
        phoneNumber: '1234567890',
        linkPrecedence: 'primary',
      },
    });

    const response = await request(app).post('/identify').send({
      email: 'secondary@example.com',
      phoneNumber: '1234567890',
    });

    expect(response.status).toBe(200);
    expect(response.body.contact).toEqual({
      primaryContactId: 1,
      emails: expect.arrayContaining([
        'primary@example.com',
        'secondary@example.com',
      ]),
      phoneNumbers: ['1234567890'],
      secondaryContactIds: [2],
    });
  });

  it('should link two primary contacts', async () => {
    // Create multiple contacts
    const newContacts = await prisma.contact.createMany({
      data: [
        {
          email: 'one@example.com',
          phoneNumber: '1111111111',
          linkPrecedence: 'primary',
        },
        {
          email: 'two@example.com',
          phoneNumber: '2222222222',
          linkPrecedence: 'primary',
        },
      ],
    });

    const response = await request(app)
      .post('/identify')
      .send({ email: 'two@example.com', phoneNumber: '1111111111' });

    expect(response.status).toBe(200);
    expect(response.body.contact).toEqual({
      primaryContactId: 1,
      emails: expect.arrayContaining(['one@example.com', 'two@example.com']),
      phoneNumbers: expect.arrayContaining(['1111111111', '2222222222']),
      secondaryContactIds: expect.arrayContaining([2]),
    });
  });

  it('should consolidate information from multiple contacts', async () => {
    // Create multiple contacts
    await prisma.contact.createMany({
      data: [
        {
          email: 'one@example.com',
          phoneNumber: '1111111111',
          linkPrecedence: 'primary',
        },
        {
          email: 'two@example.com',
          phoneNumber: '2222222222',
          linkPrecedence: 'secondary',
          linkedId: 1,
        },
      ],
    });

    const response = await request(app)
      .post('/identify')
      .send({ email: 'two@example.com', phoneNumber: '3333333333' });

    expect(response.status).toBe(200);
    expect(response.body.contact).toEqual({
      primaryContactId: 1,
      emails: expect.arrayContaining(['one@example.com', 'two@example.com']),
      phoneNumbers: expect.arrayContaining([
        '1111111111',
        '2222222222',
        '3333333333',
      ]),
      secondaryContactIds: expect.arrayContaining([2, 3]),
    });
  });
});
