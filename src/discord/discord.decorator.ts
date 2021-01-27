import { ExtraContext, reportRequestException } from '@app/sentry/reporting';
import { Logger } from '@nestjs/common';
import { OnCommandDecoratorOptions } from 'discord-nestjs';

import { Channel } from './discord.const';

const logger = new Logger(`bots/discord`);

/**
 * On command decorator
 */
export const Command = (options: OnCommandDecoratorOptions): MethodDecorator => {
  return (
    target: Record<string, any>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    Reflect.defineMetadata('ON_MESSAGE_DECORATOR', options, target, propertyKey);
    const originalMethod = descriptor.value;
    descriptor.value = async function (...params: any[]) {
      const author = params[0].author;
      const channel = params[0].channel.id;
      if (process.env.NODE_ENV === 'production' && channel === Channel.TEST) {
        return;
      }
      logger.debug(
        `command '${options.name}' invoked by ${author.username}#${author.discriminator} with content: '${params[0].content}'`,
      );
      try {
        return await originalMethod.apply(this, params);
      } catch (err) {
        const excContexts: ExtraContext[] = [];
        excContexts.push({
          name: 'discord',
          fieldData: {
            author: `${author.username}#${author.discriminator}`,
            content: params[0].content,
            channel,
            command: options.name,
          },
        });
        reportRequestException(err, excContexts);
      }
    };
    return descriptor;
  };
};
