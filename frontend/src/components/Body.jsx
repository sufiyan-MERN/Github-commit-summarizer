import { useEffect, useState } from "react";
import axios from "axios";

const Body=()=>{
     const [githubURL, setGithubURL] = useState("");
  const [data, setData] = useState(null)

  const handleSubmit = async () => {
    console.log("Backend called");

    console.log(githubURL);

    const response = await axios.get(
      "http://localhost:8080/summarisecommit?githubURL=" + githubURL,
    );

    console.log("data recieved from backend", response.data);

    setData(response.data.data)
  };

  return (
    <div>
      <h1>commit summarizer page</h1>

      <input
        onChange={(e) => {
          setGithubURL(e.target.value);
        }}
        value={githubURL}
        type="text"
        placeholder="Enter github URL:: "
      />

      <button onClick={handleSubmit}>Submit</button>

      {data && <div>
        {data.map((commitObj)=>{
          return <div>{commitObj.summary} </div>
        })}
        </div>}
    </div>
  );
}


  //           summary :summaryText,
  //           commitHash:commitArray[index]?.sha,
  //           commitMessage:commitArray[index]?.commit?.message,
  //           commitAuthorName:commitArray[index].author?.name,
  //           commitAuthorImg:commitArray[index]?.author?.avatar_url,
  //           commitData:commitArray[index]?.commit?.author?.date
export default Body;