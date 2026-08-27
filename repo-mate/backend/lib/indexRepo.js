import loadGithubRepo from "./githubLoader.js";

export default async function indexRepo(githubURL,githubToken) {
    loadGithubRepo(githubURL,githubToken)
    console.log("i");
}