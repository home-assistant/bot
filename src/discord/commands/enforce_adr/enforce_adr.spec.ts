import { ADRS, CommandEnforceAdr, NAME } from './enforce_adr.command';

describe(NAME, () => {
  let command: CommandEnforceAdr;
  const githubService = {
    authenticate: jest.fn(),
    pullRequestUpdate: jest.fn(),
    pullRequestReview: jest.fn(),
    issueAddLabels: jest.fn(),
  };
  const messageMock = {
    author: { username: 'Luke Skywalker' },
    channel: { send: jest.fn() },
    react: jest.fn(),
    content: '',
  };

  beforeEach(() => {
    githubService.authenticate.mockReset();
    githubService.pullRequestUpdate.mockReset();
    githubService.pullRequestReview.mockReset();
    githubService.issueAddLabels.mockReset();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    command = new CommandEnforceAdr(githubService);
    command.logger.debug = jest.fn();
    command.logger.error = jest.fn();
    command.logger.log = jest.fn();
    messageMock.content = '';
    messageMock.react.mockReset();
    messageMock.channel.send.mockReset();
  });

  it('Wrong arguments', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await command.command(messageMock);
    expect(messageMock.channel.send).toBeCalledWith(
      expect.objectContaining({ title: 'Arguments are not valid for this command' }),
    );
  });

  it('No matching ADR', async () => {
    messageMock.content = '0 awesome/1337';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await command.command(messageMock);
    expect(messageMock.channel.send).toBeCalledWith(
      "ADR 0 is not one of the configured ADR's (7,10,7-config-flow)",
    );
  });

  it('PR Was updated', async () => {
    messageMock.content = '7 awesome/1337';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await command.command(messageMock);
    expect(githubService.pullRequestReview).toBeCalledWith(
      expect.objectContaining({ event: 'REQUEST_CHANGES', body: ADRS['7'] }),
    );
    expect(githubService.issueAddLabels).toBeCalledWith(
      expect.objectContaining({ labels: ['adr-0007'] }),
    );
    expect(githubService.pullRequestUpdate).toBeCalledWith(
      expect.objectContaining({ state: 'closed' }),
    );
    expect(messageMock.channel.send).toBeCalledWith(
      'ADR 0007 has been enforced on <https://github.com/home-assistant/awesome/pull/1337>',
    );
  });
});
