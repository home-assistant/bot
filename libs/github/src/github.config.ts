/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config();

const conf = convict({
  github: {
    appId: {
      default: '',
      doc: 'Github App ID',
      env: 'GITHUB_APP_ID',
      format: String,
    },
    privateKey: {
      default: '',
      doc: 'Github private key',
      env: 'GITHUB_PRIVATE_KEY',
      format: String,
    },
    clientId: {
      default: '',
      doc: 'Github client ID',
      env: 'GITHUB_CLIENT_ID',
      format: String,
    },
    clientSecret: {
      default: '',
      doc: 'Github client secret',
      env: 'GITHUB_CLIENT_SECRET',
      format: String,
    },
  },
});

conf.validate({ allowed: 'strict' });
const Config = conf;

export type AppConfig = ReturnType<typeof Config['getProperties']>;
export default Config;
