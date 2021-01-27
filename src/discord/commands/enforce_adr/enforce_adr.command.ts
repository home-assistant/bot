import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';
import { GithubService } from '../../../../libs/github/src/github.service';
import { Emoji, Channel } from '../../discord.const';
import { Command } from '../../discord.decorator';
import { CommandBase } from '../base/base.command';
import { adr0007 } from './adr/0007';
import { adr0010 } from './adr/0010';

export const NAME = 'enforce_adr';
export const ADRS = {
  7: adr0007,
  10: adr0010,
};

const MATCH = /(\d+) (.*)\/(\d+)/;

@Injectable()
export class CommandEnforceAdr extends CommandBase {
  constructor(private githubService: GithubService) {
    super();
  }
  @Command({ name: NAME, allowChannels: [Channel.TEST] })
  async command(message: Message): Promise<void> {
    const owner = 'home-assistant';
    if (!message.content) {
      await message.react(Emoji.RED_X);
      await message.channel.send(
        new MessageEmbed({
          title: 'Arguments are not valid for this command',
          description: `arguments: \`${message.content}\``,
          fields: [
            { name: 'usage', value: `!${NAME} adr-number reponame/pr-number` },
            { name: 'example', value: `!${NAME} 7 core/1337` },
          ],
        }),
      );
      return;
    }
    const [_input, adr, repo, number] = MATCH.exec(message.content);
    const adrNumber = Number(adr);
    console.log(adrNumber);

    if (!ADRS[adrNumber]) {
      await message.react(Emoji.RED_X);
      await message.channel.send(
        `ADR ${adrNumber} is not one of the configured ADR's (${Object.keys(ADRS)})`,
      );
      return;
    }

    await this.githubService.pullRequestReview({
      owner,
      repo,
      pull_number: Number(number),
      body: ADRS[adrNumber],
      event: 'REQUEST_CHANGES',
    });
    await this.githubService.issueAddLabels({
      owner,
      repo,
      issue_number: Number(number),
      labels: [`adr-${adrNumber.toString().padStart(4, '0')}`],
    });
    await this.githubService.pullRequestUpdate({
      owner,
      repo,
      pull_number: Number(number),
      state: 'closed',
    });
    await message.channel.send(
      `ADR ${adrNumber
        .toString()
        .padStart(
          4,
          '0',
        )} has been enforced on <https://github.com/${owner}/${repo}/pull/${number}>`,
    );
  }
}
