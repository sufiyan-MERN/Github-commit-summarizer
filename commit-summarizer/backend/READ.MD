# Step 1: 
    - server.js > client provide GithubURL

# Step 2 (fetch commits using octokit): 
    - spliting owner and repo from GithubURL
    - fetch commits using owner and repo
    - result: array of commit objects 
    - each hash from each commit object

# Step 3 (fetch diff using hash):
    - fetching diff using "GithubURL" + "/commit/" + hash + ".diff
    - result: diff text

# Step 4 (generate summary using diff text):
    - Gemini: system prompt + diff text
    - result: summary of diff

# Step 5 (old commit object + final summary):
