import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RabbitMQService],
})
export class UserModule {}
