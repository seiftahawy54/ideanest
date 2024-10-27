import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrganizationDto } from './dto/organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: OrganizationDto }) // Assuming you have a DTO for organization creation
  @ApiResponse({
    status: 200,
    description: 'Organization created successfully',
    schema: {
      example: {
        id: 'org123',
        name: 'My Organization',
        description: 'Description of the organization',
      },
    },
  })
  async create(
    @User() user: { id: string },
    @Body() data: { name: string; description: string },
  ) {
    return this.organizationService.create(data, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the organization to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    schema: {
      example: {
        id: 'org123',
        name: 'My Organization',
        description: 'Description of the organization',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async getOne(@Param('id') id: string) {
    return this.organizationService.getOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations',
    schema: {
      example: [
        {
          id: 'org123',
          name: 'My Organization',
          description: 'Description of the organization',
        },
        {
          id: 'org456',
          name: 'Another Organization',
          description: 'Description of another organization',
        },
      ],
    },
  })
  async getAll() {
    return this.organizationService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id/invite')
  @ApiOperation({ summary: 'Invite a member to the organization' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the organization' })
  @ApiBody({
    schema: {
      properties: {
        user_email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation sent successfully',
    schema: {
      example: {
        message: 'Invitation sent successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async addMember(
    @Param('id') id: string,
    @Body() data: { user_email: string },
  ) {
    return this.organizationService.invite(id, data.user_email);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an organization by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the organization to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
    schema: {
      example: {
        message: 'Organization deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async delete(@Param('id') id: string) {
    return this.organizationService.delete(id);
  }
}
