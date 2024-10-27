import { HttpException, Injectable } from '@nestjs/common';
import { Organization } from '../schemas/organization.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(
    data: { name: string; description: string },
    user: { id: string },
  ) {
    try {
      const organization = new this.organizationModel({
        ...data,
        createdBy: user.id,
      });
      const saved = await organization.save();

      return {
        organization_id: saved._id,
      };
    } catch {
      throw new HttpException('Failed to create organization', 400);
    }
  }

  getOne(id: string): Promise<Organization | null> {
    return this.organizationModel
      .findById(id)
      .populate('createdBy', 'name email');
  }

  async getAll(): Promise<Organization[]> {
    return this.organizationModel
      .find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
  }

  async invite(id: string, userEmail: string) {
    try {
      const organization = await this.organizationModel.findById(id);
      if (!organization) {
        throw new HttpException('Organization not found', 404);
      }

      const user = await this.userModel.findOne({ email: userEmail });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      organization.members.push(user);
      await organization.save();

      return {
        message: 'User invited',
      };
    } catch {
      throw new HttpException('Failed to invite member', 400);
    }
  }

  delete(id: string) {
    const deleted = this.organizationModel.findByIdAndDelete(id);
    return deleted || null;
  }
}
