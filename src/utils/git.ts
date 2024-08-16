import * as github from '@actions/github';
import { exec } from '@actions/exec';
import { logger } from './config';

/* *
 * GitHubのowner名やrepo名が正しくない場合はエラーにする
  * @param value GitHubのowner名やrepo名
  * @param options オプション
  * @param options.name GitHubのowner名やrepo名の名前
  * @param options.throwOnFail エラーが発生した場合に例外をスローするかどうか
  * @returns 正しい場合はtrue、正しくない場合はfalse
  */
const validateGitHub = (value: string, options?: { name?: string, throwOnFail?: boolean }) => {
  const pattern = /^[a-zA-Z0-9-]+$/;
  const result = pattern.test(value);

  if (!result) {
    let msg = `Invalid GitHub name: ${value}`;
    if (options?.name) {
      msg = `Invalid GitHub ${options.name} name: ${value}`;
    }

    if (options?.throwOnFail) { throw new Error(msg); }
    console.debug(msg);

    throw new Error(msg);
  }

  return result;
}

export async function initializeGitConfig() {
  await exec('git', ['config', '--global', 'user.name', 'github-actions']);
  await exec('git', ['config', '--global', 'user.email', 'actions@github.com']);
}

export async function initializeUpstream(token: string, owner?: string, repo?: string) {
  if (owner == null || repo == null) {
    try {
      const { data: repoData } = await github.getOctokit(token).rest.repos.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
      });
      owner = repoData.parent?.owner?.login;
      repo = repoData.parent?.name;

      logger.debug(`Upstream owner (with parent): ${owner}`);
      logger.debug(`Upstream repo (with parent): ${repo}`);
      if (owner && repo) {
        logger.info(`Upstream repository (from fork parent) : ${owner}/${repo}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }

      throw new Error("Failed to get repository information.\nUpstream owner and repo must be specified or provided through a fork relationship.");
    }
  }

  validateGitHub(owner, { name: 'owner', throwOnFail: true });
  validateGitHub(repo, { name: 'repo', throwOnFail: true });

  const upstreamUrl = `https://github.com/${owner}/${repo}.git`;

  // 既にupstreamが存在する場合を考慮して、一度削除してから追加することで上書きする
  try {
    await exec('git', ['remote', 'remove', 'upstream']);
  } catch (error) {
    logger.debug('Failed to remove branch upstream. This may be due to no existing upstream to remove.');
  }
  await exec('git', ['remote', 'add', 'upstream', upstreamUrl]);

  // (private repoなこともあるため)tokenを使って認証する
  await exec('git', ['config', '--global', `url."https://x-access-token:${token}@github.com".insteadOf`, 'https://github.com']);

  // upstreamをfetchする
  // upstreamが取得できない場合はエラーにする
  try {
    await exec('git', ['fetch', 'upstream']);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw new Error(`Failed to fetch upstream repository: ${upstreamUrl}`);
  }

  return {
    owner,
    repo,
    upstreamUrl,
  };
}
