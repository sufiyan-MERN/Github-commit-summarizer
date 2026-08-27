import { generateDiff } from "./lib/generateDiff.js";
import { getAiSummary } from "./lib/getAiSummary.js";
import { getCommits } from "./lib/getCommit.js";


export async function main(githubURL) {
    const commitArray= await getCommits(githubURL)
    console.log("commit array",commitArray.length);
    
    const diffArrayPromise = commitArray.map( async (commitObj)=>{
        const diff= await generateDiff(githubURL,commitObj.sha)
        // console.log("-----diff-----",diff);
        return diff
    })

    const diffArray= await Promise.all(diffArrayPromise)
    console.log("diff array generated",diffArray.length);

    const summaryArrayPromise = diffArray.map( async (diffObj,index)=>{
        const summary= await getAiSummary(diffObj)
        return summary
    })

    const summaryArray= await Promise.all(summaryArrayPromise)
    console.log("summary array generated",summaryArray);

    const finalDataArray= summaryArray.map((summaryText,index)=>{
        return {
            summary:summaryText,
            commitHash:commitArray[index]?.sha,
            commitMessage:commitArray[index]?.commit?.message,
            commitAuthorName:commitArray[index].author?.name,
            commitAuthorImg:commitArray[index]?.author?.avatar_url,
            commitData:commitArray[index]?.commit?.author?.date
        }
    })

    return finalDataArray
}
// main("https://github.com/ZayeemMohd/small-test")