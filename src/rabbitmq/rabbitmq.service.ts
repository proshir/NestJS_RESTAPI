import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private channel: Channel;
  private connection: Connection;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');
    this.connection = await connect(rabbitMQUrl);
    this.channel = await this.connection.createChannel();
  }

  async sendNotification(queue: string, message: string) {
    if (!this.channel) {
      throw new Error('RabbitMQ connection not established');
    }

    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Notification sent: ${message}`);
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
