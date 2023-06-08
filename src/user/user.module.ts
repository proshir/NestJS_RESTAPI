import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RabbitMQService],
})
export class UserModule {}
