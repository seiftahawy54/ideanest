import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import bcrypt from 'bcrypt';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Injectable()
@ApiTags('User') // Tag this controller or route with 'User'
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    schema: {
      example: {
        message: 'Account created successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
    schema: {
      example: {
        message: 'User already exists',
        error: true,
      },
    },
  })
  async create(newUser: CreateUserDto): Promise<{
    message: string;
    error?: boolean;
  }> {
    const existingUser = await this.findOne(newUser.email);
    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const user = new this.userModel(newUser);

    await user.save();

    return {
      message: 'Account created successfully',
    };
  }

  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({ name: 'email', type: String, description: 'User email' })
  @ApiQuery({
    name: 'fields',
    type: String,
    required: false,
    description: 'Fields to select',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      example: {
        _id: '60d0fe4f5311236168a109ca',
        email: 'test@example.com',
        name: 'John Doe',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(email: string, fields = ''): Promise<User> {
    return this.userModel
      .findOne({
        email,
      })
      .select(fields)
      .lean();
  }

  /**
   * Compares an entered password with a hashed password.
   * @param enteredPassword - The password input by the user
   * @param password - The stored hashed password
   * @returns boolean - Whether the passwords match
   */
  async comparePasswords(enteredPassword: string, password: string) {
    return bcrypt.compareSync(enteredPassword, password);
  }
}
