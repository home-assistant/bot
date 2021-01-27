import { Endpoints } from '@octokit/types';

export type UpdatePullParameters = Endpoints['PATCH /repos/{owner}/{repo}/pulls/{pull_number}']['parameters'];
export type ReviewPullParameters = Endpoints['POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['parameters'];
export type AddIssueLabelsParameters = Endpoints['POST /repos/{owner}/{repo}/issues/{issue_number}/labels']['parameters'];
