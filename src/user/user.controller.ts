import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('user/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(+id);
  }

  @Get('user/:id/avatar')
  detAvatar(@Param('id') id: string) {
    return this.userService.getAvatar(id);
  }

  @Delete(':user/:id/avatar')
  deleteAvatar(@Param('id') id: string) {
    return this.userService.deleteAvatar(id);
  }
}
