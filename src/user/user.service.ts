import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as turf from '@turf/turf';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import EgyptBoundaries from '../../utils/EgyptBoundaries';
import axios from 'axios';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user.
   *
   * This method performs several checks before creating a new user:
   * - It verifies if a user with the same email already exists.
   * - It checks if the provided coordinates are within the boundaries of Egypt.
   * - It fetches the city name from an external geocoding service based on the coordinates.
   *
   * @param {CreateUserDto} newUser - The data transfer object containing the new user's details.
   * @returns {Promise<Prisma.UserCreateInput | { error: string }>} A promise that resolves to the created user data or an error object.
   *
   * @example
   * // Request Body:
   * {
   *   "name": "John Doe",
   *   "email": "john.doe@example.com",
   *   "lat": 30.0444,
   *   "long": 31.2357
   * }
   *
   * @example
   * // Success Response:
   * {
   *   "id": 1,
   *   "name": "John Doe",
   *   "email": "john.doe@example.com",
   *   "lat": 30.0444,
   *   "long": 31.2357,
   *   "city": "Cairo"
   * }
   *
   * @example
   * // Error Response (User already exists):
   * {
   *   "error": "User already exists"
   * }
   *
   * @example
   * // Error Response (Coordinates not within Egypt):
   * {
   *   "error": "User coordinates are not within Egypt"
   * }
   *
   * @example
   * // Error Response (Geocoding service failure):
   * {
   *   "error": "Failed to fetch city from geocoding service"
   * }
   */

  async create(
    newUser: CreateUserDto,
  ): Promise<Prisma.UserCreateInput | { error: string }> {
    // Find user with same email
    const user = await this.prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (user) {
      return {
        error: 'User already exists',
      };
    }

    // Check if user coordinates inside Egypt
    const userLocation = turf.point([newUser.lat, newUser.long]);
    const castedEgyptBoundaries = turf.polygon(EgyptBoundaries);
    const isWithinEgypt = booleanPointInPolygon(
      userLocation,
      castedEgyptBoundaries,
    );

    if (!isWithinEgypt) {
      return {
        error: 'User coordinates are not within Egypt',
      };
    }

    // Fetch city name
    const urlService = `https://api.opencagedata.com/geocode/v1/json?q=${newUser.lat}+${newUser.long}&key=${process.env.MAPS_API_KEY}`;

    try {
      const response = await axios(urlService);
      console.log(`Response: ${response.data.results[0].components.city}`);
      newUser.city = response.data.results[0].components.city;
    } catch (error) {
      console.log(error);
    }

    return this.prisma.user.create({
      data: newUser,
    });
  }

  /**
   * Retrieve a user by ID.
   *
   * This method searches for a user in the database using the provided ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<User | { error: string }>} A promise that resolves to the user object if found, or an error object if not.
   *
   * @example
   * // Request:
   * const userId = 1;
   * const user = await userService.findOne(userId);
   *
   * @example
   * // Success Response:
   * {
   *   "id": 1,
   *   "name": "John Doe",
   *   "email": "john.doe@example.com",
   *   "lat": 30.0444,
   *   "long": 31.2357
   * }
   *
   * @example
   * // Error Response (User not found):
   * {
   *   "error": "User not found"
   * }
   */

  async findOne(id: number): Promise<User | { error: string }> {
    const searchResult = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!searchResult) {
      return {
        error: 'User not found',
      };
    }

    return searchResult;
  }
}
