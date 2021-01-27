/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config();

const conf = convict({
  discord: {
    token: {
      default: '',
      doc: 'Discord bot token',
      env: 'DISCORD_BOT_TOKEN',
      format: String,
    },
    commandPrefix: {
      default: '!',
      doc: 'Discord commands prefix',
      env: 'DISCORD_COMMAND_PREFIX',
      format: String,
    },
    allowGuilds: {
      default: '',
      doc: 'Discord guild allowlist',
      env: 'DISCORD_GUILD_ALLOWLIST',
      format: String,
    },
  },
  env: {
    default: 'development',
    doc: 'The current node.js environment',
    env: 'NODE_ENV',
    format: ['test', 'development', 'stage', 'production'],
  },
  sentryDsn: {
    default: '',
    doc: 'Sentry DSN for error and log reporting',
    env: 'SENTRY_DSN',
    format: String,
  },
  server: {
    port: {
      default: 3000,
      doc: 'Port to listen on for connections',
      env: 'SERVER_PORT',
      format: Number,
    },
  },
});

conf.validate({ allowed: 'strict' });
const Config = conf;

export type AppConfig = ReturnType<typeof Config['getProperties']>;
export default Config;
