import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User account created successfully',
    schema: {
      example: {
        message: 'Account created successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request. The user may already exist, or the input may be invalid.',
    schema: {
      example: {
        message: 'User already exists',
        error: true,
      },
    },
  })
  signup(@Body() userData: CreateUserDto) {
    return this.authService.signUp(
      userData.email,
      userData.name,
      userData.password,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'jwt_token_example',
        message: 'Login successful',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
    schema: {
      example: {
        message: 'Invalid email or password',
        error: true,
      },
    },
  })
  signIn(@Body() userData: { email: string; password: string }) {
    return this.authService.signIn(userData.email, userData.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string', example: 'current_jwt_token_example' },
      },
    },
    description: 'Current JWT token to refresh',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'new_jwt_token_example',
        message: 'Token refreshed successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired token.',
    schema: {
      example: {
        message: 'Invalid or expired token',
        error: true,
      },
    },
  })
  refreshToken(@Body() data: { token: string }) {
    return this.authService.refreshToken(data.token);
  }
}
