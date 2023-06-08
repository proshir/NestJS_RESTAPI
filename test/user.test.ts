import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import axios from 'axios';
import { INestApplication } from '@nestjs/common';

describe('UserController (Integration tests with all endpoints)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AppModule,
        PrismaModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });
  describe('1. Clear Database', () => {
    it('should clear database', async () => {
      await prismaService.cleanDb();
    });
  });
  describe('2. POST /api/users', () => {
    it('should throw a validation error if a required parameter is missing', async () => {
      const requestBody = {
        first_name: 'Hassan',
        last_name: 'Ardeshir',
      };
      const axiosInstance = axios.create({
        validateStatus: () => true,
      });
      try {
        const response = await axiosInstance.post(
          'http://localhost:3000/api/users',
          requestBody,
        );
        expect(response.status).toEqual(400);
      } catch (error) {
        console.log(error.respnse);
        throw error;
      }
    });
    it('should throw a validation error if provided an invalid email value', async () => {
      const requestBody = {
        email: 'email.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'http://',
      };
      const axiosInstance = axios.create({
        validateStatus: () => true,
      });
      try {
        const response = await axiosInstance.post(
          'http://localhost:3000/api/users',
          requestBody,
        );
        expect(response.status).toEqual(400);
      } catch (error) {
        console.log(error.respnse);
        throw error;
      }
    });
    it('should store user in collection, send a welcome email message and a RabbitMQ event', async () => {
      const requestBody = {
        email: 'johndoe@email.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'http://',
      };
      const axiosInstance = axios.create();
      try {
        const response = await axiosInstance.post(
          'http://localhost:3000/api/users',
          requestBody,
        );
        expect(response.status).toEqual(201);
      } catch (error) {
        console.log(error.respnse);
        throw error;
      }
    });
  });
  let userId: string;
  describe('3. GET /api/user/{userId}', () => {
    it('should retrieve data from external API and return a user as JSON', async () => {
      const axiosInstance = axios.create();
      try {
        const response = await axiosInstance.get(
          'http://localhost:3000/api/user/1',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toHaveProperty('email');
      } catch (error) {
        console.log(error.respnse);
        throw error;
      }
    });
    it('should return a server error if userId is greater than size', async () => {
      const axiosInstance = axios.create({
        validateStatus: () => true,
      });
      try {
        const response = await axiosInstance.get(
          'http://localhost:3000/api/user/100',
        );
        userId = response.data.id;
        expect(response.status).toEqual(404);
      } catch (error) {
        console.log(error.respnse);
        throw error;
      }
    });
  });
});
