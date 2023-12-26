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
    const listOfBranchNames = extractBranchNames(listOfBranches.data);

    const commitUrl = `/repos/${repo}/commits`
    const listOfHeadCommits = await getCommits(octokit, commitUrl, listOfBranchNames);
}

async function getCommits(octokit, url, listOfBranchNames) {
    const completeListOfHeadCommits = new Array();
    for (var i = 0; i < listOfBranchNames.length; i++) {
        const response = await octokit.request('GET {url}/heads/{branch}', {
            url: url,
            branch: listOfBranchNames[i],
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        completeListOfHeadCommits.push(response);
        log(`Commit ${listOfBranchNames[i]}`);
        logJson(response);
    }
    return completeListOfHeadCommits;
}

function extractBranchNames(listOfBranches) {
    const listOfBranchNames = new Array();
    for (var i = 0; i < listOfBranches.length; i++) {
        log(`Element ${i}: ${listOfBranches[i].name}`);
        listOfBranchNames.push(listOfBranches[i].name);
    }
    return listOfBranchNames;
}

async function getListOfBranches(octokit, url) {
    const response = await octokit.request('GET {url}', {
        url: url,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    logJson(response);
    return response;
}

run();
