import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { deleteAvatar, readAvatar, saveAvatar } from './avatar-util';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class UserService {
  queue: string;
  constructor(
    private prisma: PrismaService,
    private readonly rabbitService: RabbitMQService,
  ) {
    this.queue = 'emails';
  }

  async create(userData: CreateUserDto) {
    const err = await validate(userData);
    if (err.length > 0) throw new BadRequestException(err);
    const userExists = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const createdUser = await this.prisma.user.create({
      data: { ...userData },
    });

    await this.rabbitService.sendNotification(this.queue, createdUser.email);
    return createdUser;
  }

  async findOneById(id: number) {
    const apiUrl = `https://reqres.in/api/users/${id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new NotFoundException('Failed to fetch user data from the API.');
    }

    const responseData = await response.json();
    if (!responseData || !responseData.data) {
      throw new NotAcceptableException(
        'Invalid user data received from the API.',
      );
    }

    return responseData.data;
  }

  async getAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    let avatar_hash = user.avatar_hash;
    if (!avatar_hash) {
      avatar_hash = await saveAvatar(user.avatar);
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar_hash: avatar_hash },
      });
    }
    const avatar = readAvatar(avatar_hash);
    return avatar;
  }

  async deleteAvatar(id: string) {
    let user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(
        `The user with the specified id ${id} does not exist`,
      );
    }
    if (!user.avatar_hash) {
      throw new NotAcceptableException(
        `The user with id ${id} has no saved avatar at all.`,
      );
    }
    const avatar_hash = user.avatar_hash;
    user = await this.prisma.user.update({
      where: { id: id.toString() },
      data: { avatar_hash: '' },
    });

    deleteAvatar(avatar_hash);

    return user;
  }
}
