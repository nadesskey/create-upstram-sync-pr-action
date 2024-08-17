import * as core from '@actions/core';
import Logger from './logger';
export const logger = Logger.use('[upstream-sync]');
function getOptionalInput(name, defaultValue) {
    const value = core.getInput(name, { required: false });
    return value !== '' ? value : defaultValue;
}
export function getConfig() {
    // github actionsで実行されるため、GITHUB_TOKENはundefinedになることはない
    const token = core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN;
    const base = core.getInput('base', { required: true });
    const upstreamOwner = getOptionalInput('upstream-owner');
    const upstreamRepo = getOptionalInput('upstream-repo');
    const head = core.getInput('head', { required: true }); // `head`はブランチ名として扱う
    logger.debug(`base: ${base}`);
    logger.debug(`upstreamOwner: ${upstreamOwner}`);
    logger.debug(`upstreamRepo: ${upstreamRepo}`);
    logger.debug(`head: ${head}`);
    return {
        token,
        base,
        upstreamOwner,
        upstreamRepo,
        head,
    };
}
