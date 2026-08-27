import { useState } from "react";
import axios from "axios";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "Unknown date";

const Body = () => {
  const [githubURL, setGithubURL] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!githubURL.trim()) {
      setError("Paste a GitHub repository URL first.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:8080/summarisecommit",
        { params: { githubURL } },
      );
      setData(response.data.data || []);
    } catch {
      setData(null);
      setError(
        "Could not read this repository. Check the URL and your backend connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="top">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> REPOSITORY INTELLIGENCE, SIMPLIFIED
          </p>
          <h1>
            Read the work
            <br />
            <em>behind the code.</em>
          </h1>
          <p className="hero-text">
            Commit Lens turns a GitHub history into a clear narrative, so you
            can understand the decisions, progress, and momentum inside a
            project.
          </p>
          <a className="hero-link" href="#analyzer">
            Analyze a repository <span>↓</span>
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-square" />
          <div className="art-line line-one" />
          <div className="art-line line-two" />
          <div className="art-note">
            CHANGE
            <br />
            <strong>+</strong>
            <br />
            CONTEXT
          </div>
          <div className="art-dot" />
        </div>
      </section>

      <section className="analyzer-section" id="analyzer">
        <div className="section-label">01 / ANALYZE</div>
        <div className="section-intro">
          <h2>Where should we look?</h2>
          <p>
            Use a public GitHub repository URL
            <br />
            to generate your commit timeline.
          </p>
        </div>
        <form className="analyzer-form" onSubmit={handleSubmit}>
          <input
            onChange={(event) => setGithubURL(event.target.value)}
            value={githubURL}
            type="url"
            placeholder="https://github.com/owner/repository"
            aria-label="GitHub repository URL"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Reading commits..." : "Summarize commits"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        {error && <p className="message error">{error}</p>}
        {!data && !error && (
          <p className="message">
            <span>✦</span> Best with a repository that has a few commits to
            explore.
          </p>
        )}
      </section>

      {data && (
        <section className="results-section" aria-live="polite">
          <div className="results-heading">
            <div>
              <div className="section-label">02 / TIMELINE</div>
              <h2>Recent commits</h2>
            </div>
            <div className="commit-total">
              <strong>{data.length}</strong>
              <span>
                decoded
                <br />
                commits
              </span>
            </div>
          </div>
          {data.length === 0 ? (
            <p className="empty-state">
              No commits were returned for this repository.
            </p>
          ) : (
            <div className="commit-list">
              {data.map((commitObj, index) => (
                <article
                  className="commit-card"
                  key={commitObj.commitHash || index}
                >
                  <div className="commit-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="commit-content">
                    <div className="commit-meta">
                      <span className="author">
                        <img src={commitObj.commitAuthorImg} alt="" />
                        {commitObj.commitAuthorName || "Unknown author"}
                      </span>
                      <span>{formatDate(commitObj.commitData)}</span>
                      <code>
                        { "commit hash: " + commitObj.commitHash?.slice(0, 12) || "-------"}
                      </code>
                    </div>
                    <h3>{commitObj.commitMessage || "Untitled commit"}</h3>
                    <p>
                      {commitObj.summary ||
                        "No summary available for this commit."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      
    </main>
  );
};

export default Body;
