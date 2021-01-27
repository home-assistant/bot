import { Injectable, Logger } from '@nestjs/common';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/core';
import { request } from '@octokit/request';
import Config from './github.config';
import {
  AddIssueLabelsParameters,
  ReviewPullParameters,
  UpdatePullParameters,
} from './github.constants';

const config = Config.getProperties();
const activeInstallations: Map<string, number> = new Map();

@Injectable()
export class GithubService {
  logger: Logger;
  client: Octokit;

  constructor() {
    this.logger = new Logger('github');
  }

  private async authenticate(namespace: string): Promise<void> {
    let installationId: number;
    let _installations: any;
    const auth = createAppAuth({
      appId: config.github.appId,
      privateKey: config.github.privateKey,
      clientId: config.github.clientId,
      clientSecret: config.github.clientSecret,
    });

    if (activeInstallations.size === 0) {
      this.logger.log('No cached installations found, fetching all.');
      const { data: installations } = await auth.hook(request, 'GET /app/installations');
      installations.forEach((installation) => {
        activeInstallations.set(installation.account.login, installation.id);
      });
    }

    if (activeInstallations.has(namespace)) {
      this.logger.log(
        `Using installationID ${activeInstallations.get(namespace)} for ${namespace}`,
      );
      installationId = activeInstallations.get(namespace);
    } else {
      this.logger.log(`Getting installationID for ${namespace}`);
      if (!_installations) {
        _installations = (await auth.hook(request, 'GET /app/installations')).data;
      }

      const installationDetails = _installations.find(
        (installation) => installation.account.login === namespace,
      );
      if (!installationDetails) {
        throw new Error(`No installation for ${namespace}`);
      }
      activeInstallations.set(namespace, installationDetails.id);
      installationId = activeInstallations.get(namespace);
    }
    const installationAuthentication = await auth({
      type: 'installation',
      installationId,
    });
    this.client = new Octokit({
      auth: installationAuthentication.token,
    });
  }

  public async pullRequestUpdate(options: UpdatePullParameters): Promise<void> {
    if (!this.client) {
      await this.authenticate(options.owner);
    }
    try {
      await this.client.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', options);
    } catch (err) {
      this.logger.error(err);
    }
  }
  public async pullRequestReview(options: ReviewPullParameters): Promise<void> {
    if (!this.client) {
      await this.authenticate(options.owner);
    }
    try {
      await this.client.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', options);
    } catch (err) {
      this.logger.error(err);
    }
  }
  public async issueAddLabels(options: AddIssueLabelsParameters): Promise<void> {
    if (!this.client) {
      await this.authenticate(options.owner);
    }
    try {
      await this.client.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', options);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
