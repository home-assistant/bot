import { getVersionInfo } from '@app/version';
import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { Command } from '../../discord.decorator';
import { CommandBase } from '../base/base.command';

export const NAME = 'info';

export const version = getVersionInfo(__dirname);

@Injectable()
export class CommandInfo extends CommandBase {
  @Command({ name: NAME })
  async command(message: Message): Promise<void> {
    await message.channel.send(
      new MessageEmbed({
        fields: [
          {
            name: process.env.NODE_ENV === 'production' ? 'Version' : 'Commit',
            value:
              process.env.NODE_ENV === 'production'
                ? version.version
                : version.commit?.substring(0, 7),
          },
          { name: 'Source', value: 'https://github.com/home-assistant/bot' },
        ],
      }),
    );
  }
}
