import core from '@actions/core';
import github from '@actions/github';
import { Octokit } from 'octokit';
import { log, debug, logJson, debugJson } from './common/log.js';

async function run() {
    const token = core.getInput("token");
    const repo = core.getInput("repository");

    let api = core.getInput("githubApi");
    if (api === '') {
        api = "https://api.github.com";
    }

    const octokit = new Octokit({
        baseUrl: api,
        auth: token
    });

    const branchListUrl = `/repos/${repo}/branches`;
    const listOfBranches = await getListOfBranches(octokit, branchListUrl);

}

async function getListOfBranches(octokit, url) {
    const response = await octokit.request('GET {url}', {
        url: url,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    logJson(response);
}

run();
