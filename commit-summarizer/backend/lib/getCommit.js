import { Octokit } from "octokit"
// import { generateDiff } from "./generateDiff.js";

const octokit= new Octokit()

export async function getCommits(githubURL) {
    const [owner,repo]=githubURL.split("/").slice(-2)
    const {data}= await octokit.rest.repos.listCommits({
        owner:owner,
        repo:repo
    })
   return data

}

// getCommits("https://github.com/sufiyan-MERN/react")