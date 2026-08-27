import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github"

export default async function loadGithubRepo(githubURL) {
    const loader= new GithubRepoLoader(githubURL)

    const docArray = await loader.load() 
    console.log(docArray);
}

loadGithubRepo("https://github.com/ZayeemMohd/taskflowAI")