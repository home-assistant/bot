import { CommandInfo, NAME, version } from './info.command';

const messageMock = {
  author: { username: 'Luke Skywalker' },
  channel: { send: jest.fn() },
};

describe(NAME, () => {
  let command: CommandInfo;

  beforeEach(() => {
    command = new CommandInfo();
    command.logger.debug = jest.fn();
  });

  it('Did send message', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await command.command(messageMock);
    expect(messageMock.channel.send).toBeCalledWith(
      expect.objectContaining({
        fields: [
          { inline: false, name: 'Commit', value: version.commit.substring(0, 7) },
          { inline: false, name: 'Source', value: 'https://github.com/home-assistant/bot' },
        ],
      }),
    );
  });
});
