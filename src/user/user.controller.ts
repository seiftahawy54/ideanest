import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/user.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Handle user signup.
   * route POST /api/user/signup
   * @param {Response} res - The response object.
   * @param {CreateUserDto} userData - The user data transfer object containing user details.
   *
   * @example
   * // Request Body:
   * {
   *   "name": "John Doe",
   *   "email": "john.doe@example.com"
   *   "lat": 1,
   *   "long": 1,
   * }
   * @returns {User} - The response object with the result of the signup operation.
   * {
   *   "name": "John Doe",
   *   "email": "john.doe@example.com"
   *   "lat": 1,
   *   "long": 1,
   * }
   *
   * @throws {HttpStatus.BAD_REQUEST} - If the user data is invalid.
   * {
   *   "message": ["email must be a string"],
   *   "errors": "Bad Request"
   *   "statusCode": 400
   * }
   */
  @Post('signup')
  async create(@Res() res: Response, @Body() userData: CreateUserDto) {
    const result = await this.userService.create(userData);

    if ('error' in result) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }

    return res.status(HttpStatus.CREATED).json(result);
  }

  /**
   * Search for a user based on provided criteria.
   * route GET /api/user/search
   * @param {Response} res - The response object.
   * @param {string} [name] - The name of the user to search for (optional).
   * @param {number} [id] - The ID of the user to search for (optional).
   *
   * @example
   * // Request URL:
   * // GET /api/user/search?name=John Doe
   *
   * @returns {User[]} - An array of users matching the search criteria.
   *
   * @example
   * // Success Response:
   * [
   *   {
   *     "id": 1,
   *     "name": "John Doe",
   *     "email": "john.doe@example.com",
   *     "lat": 1,
   *     "long": 1
   *   }
   * ]
   *
   * @throws {HttpStatus.BAD_REQUEST} - If the search criteria is invalid.
   * @throws {HttpStatus.NOT_FOUND} - If no users are found matching the criteria.
   *
   * @example
   * // Error Response (Invalid search criteria):
   * {
   *   "statusCode": 400,
   *   "message": "Invalid search criteria",
   *   "error": "Bad Request"
   * }
   *
   * @example
   * // Error Response (No users found):
   * {
   *   "statusCode": 404,
   *   "message": "No users found",
   *   "error": "Not Found"
   * }
   */

  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ) {
    const result = await this.userService.findOne(id);

    if (id <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'ID must be greater than 0',
      });
    }

    if ('error' in result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: result.error,
      });
    }

    return res.status(HttpStatus.OK).json(result);
  }
}
