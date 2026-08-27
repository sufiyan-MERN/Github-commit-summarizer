const Header = () => {
  return <div>
    <header className="site-header">
    <a className="brand" href="#top" aria-label="Commit Lens home">
      <span className="brand-mark">C L</span>
      <span>
        commit<span className="brand-accent">lens</span>
      </span>
    </a>
    <nav className="nav-links" aria-label="Main navigation">
      <a href="#analyzer">Analyzer</a>
      <a href="#how-it-works">How it works</a>
    </nav>
    <a className="header-action" href="#analyzer">
      Start reading <span aria-hidden="true">↗</span>
    </a>
  </header>
  </div>
  
};

export default Header;
