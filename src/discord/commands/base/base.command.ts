import { Logger } from '@nestjs/common';

export class CommandBase {
  logger: Logger;

  constructor() {
    this.logger = new Logger('bots/discord');
    this.logger.log(`${this.constructor.name} enabled`);
  }
}
