export async function generateDiff(githubURL,commitHash) {
    const response= await fetch(`${githubURL}/commit/${commitHash}.diff`)
    return response.text()
}