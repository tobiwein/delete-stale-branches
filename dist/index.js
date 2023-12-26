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
    const listOfHeadCommits = extractHeadCommits(listOfBranches.data);

    const commitUrl = `/repos/${repo}/commits`
    const completeListOfHeadCommits = await getCommits(octokit, commitUrl, listOfHeadCommits);
}

async function getCommits(octokit, url, listOfHeadCommits) {
    const completeListOfHeadCommits = new Array();
    for (var i = 0; i < listOfHeadCommits.length; i++) {
        const response = await octokit.request('GET {url}/{commit}', {
            url: url,
            commit: listOfHeadCommits[i],
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        completeListOfHeadCommits.push(response);
        log(`Commit ${listOfHeadCommits[i]}`);
        logJson(response);
    }
    return completeListOfHeadCommits;
}

function extractHeadCommits(listOfBranches) {
    const listOfHeadCommits = new Array();
    for (var i = 0; i < listOfBranches.length; i++) {
        log(`Element ${i}: ${listOfBranches[i].commit.sha}`);
        listOfHeadCommits.push(listOfBranches[i].commit.sha);
    }
    return listOfHeadCommits;
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
