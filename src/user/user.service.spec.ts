import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('CatsController', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(new PrismaService());
  });

  afterAll(() => {
    new PrismaService().user.deleteMany({
      where: {
        name: 'test',
      },
    });
  });

  describe('findOne', () => {
    it('should error message when user not found', async () => {
      const errorMessage: string = 'User not found';
      const result = (await userService.findOne(-1)) as { error: string };
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const newUser1: Prisma.UserCreateInput = {
        name: 'test',
        email: 'test@me.com',
        lat: 1,
        city: 'testing',
        long: 1,
      };

      const result = (await userService.create(
        newUser1,
      )) as Prisma.UserCreateInput;
      expect(result.name).toBe(newUser1.name);
      expect(result.email).toBe(newUser1.email);
      expect(result.lat).toBe(newUser1.lat);
      expect(result.city).toBe(newUser1.city);
      expect(result.long).toBe(newUser1.long);
    });

    it('should error message when user already exists', async () => {
      const errorMessage: string = 'User already exists';
      const newUser2: Prisma.UserCreateInput = {
        name: 'test',
        email: 'test@me.com',
        lat: 1,
        city: 'testing',
        long: 1,
      };
      const result = (await userService.create(newUser2)) as { error: string };
      expect(result.error).toBe(errorMessage);
    });
  });
});
