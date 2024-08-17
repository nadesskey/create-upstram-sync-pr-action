import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';
import { logger, getConfig } from './utils/config';
import { initializeGitConfig , initializeUpstream } from './utils/git';

async function run() {
  try {
    const { token, base, upstreamOwner, upstreamRepo, head } = getConfig();
    await initializeGitConfig(token);
    
    await exec(`git switch ${base}`);
    const upstream = await initializeUpstream(token, upstreamOwner, upstreamRepo);

    let mergeOutput = '';
    let execOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          mergeOutput += data.toString();
        }
      },
      ignoreReturnCode: true
    };

    try {
      await exec('git', ['merge', `upstream/${head}`], execOptions);
    } catch (error) {
      if (mergeOutput.includes('refusing to merge unrelated histories')) {
        core.warning('Unrelated histories detected. Retrying merge with --allow-unrelated-histories.');
        try {
          await exec('git', ['merge', `upstream/${head}`, '--allow-unrelated-histories']);
        } catch (mergeError) {
          core.setFailed('Merge failed even with --allow-unrelated-histories.');
          return;
        }
      } else if (mergeOutput.includes('CONFLICT')) {
        const errorMessage = 'Merge conflict detected. Please resolve conflicts manually.';
        core.setFailed(errorMessage);
        logger.error(errorMessage);
        return;
      }
    }

    const octokit = github.getOctokit(token);
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      state: 'open'
    }).catch(error => {
      if (error instanceof Error) {
        core.setFailed(error.message);
      } else {
        core.setFailed('An unknown error occurred.');
      }
      return { data: [] };
    });

    const existingPR = pullRequests.find(pr => 
      pr.head.ref === head &&
      pr.head.repo.full_name === `${upstream.owner}/${upstream.repo}` &&  // リモートリポジトリからのブランチか確認
      pr.base.ref === base
    );

    if (existingPR) {
      core.info(`A pull request already exists: ${existingPR.html_url}`);
      return;
    }

    try {
      const { data: pullRequest } = await octokit.rest.pulls.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: `Sync with ${upstream.owner}/${upstream.repo} ${head} to ${base}`,
        head: head,
        head_repo: `${upstream.owner}/${upstream.repo}`,
        base: base,
        body: 'This PR was automatically created to sync with upstream changes.',
        maintainer_can_modify: false
      });
      core.setOutput('pr-url', pullRequest.html_url);
    } catch (error) {
      console.debug(error);
      core.setFailed('Failed to create pull request. Have you given the necessary permissions?');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();
