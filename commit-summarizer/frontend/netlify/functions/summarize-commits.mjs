import { Octokit } from "octokit";
import { GoogleGenAI } from "@google/genai";

async function getCommits(githubURL) {
  const octokit = new Octokit();
  const [owner, repo] = githubURL.split("/").slice(-2);
  const { data } = await octokit.rest.repos.listCommits({ owner, repo });
  return data;
}

async function generateDiff(githubURL, commitHash) {
  const response = await fetch(`${githubURL}/commit/${commitHash}.diff`);
  return response.text();
}

async function getAiSummary(diff) {
  const ai = new GoogleGenAI({ apiKey: Netlify.env.get("GEMINI_API_KEY") });

  const systemPrompt = `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS (summary must be atleast 3 points):
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments. Please summarise the following diff file: \n\n${diff}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: systemPrompt,
  });

  return response.text;
}

export default async (req) => {
  const githubURL = new URL(req.url).searchParams.get("githubURL");

  if (!githubURL) {
    return Response.json(
      { msg: "githubURL query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const commitArray = await getCommits(githubURL);

    const diffArray = await Promise.all(
      commitArray.map((commitObj) => generateDiff(githubURL, commitObj.sha)),
    );

    const summaryArray = await Promise.all(
      diffArray.map((diffObj) => getAiSummary(diffObj)),
    );

    const data = summaryArray.map((summaryText, index) => ({
      summary: summaryText,
      commitHash: commitArray[index]?.sha,
      commitMessage: commitArray[index]?.commit?.message,
      commitAuthorName: commitArray[index]?.author?.name,
      commitAuthorImg: commitArray[index]?.author?.avatar_url,
      commitData: commitArray[index]?.commit?.author?.date,
    }));

    return Response.json({ msg: "get request received", data });
  } catch (error) {
    return Response.json(
      { msg: "Failed to summarize commits", error: error.message },
      { status: 500 },
    );
  }
};

export const config = {
  path: "/api/summarize-commits",
};
