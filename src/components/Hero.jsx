import { logo } from "../assets";

const Hero = () => {
  return (
    <header
      className="w-full flex
    justify-center items-center flex-col"
    >
      <nav
        className="flex justify-between
      items-center w-full mb-10 pt-3"
      >
        <div className="flex-col items-center">
          <img src={logo} alt="sumz_logo" className="w-28 object-contain" />
          <h1 className="orange_gradient text-2xl font-bold">Breeze</h1>
        </div>
        <button
          type="button"
          onClick={() => window.open("https://github.com/TidbitsJS/Summize")}
          className="black_btn"
        >
          Github
        </button>
      </nav>

      <h1 className="head_text">
        Read Smarter, not Harder with <br className="max-md:hidden" />
        <span className="orange_gradient">
          {" "}
          Breeze: an AI-Powered Summarizer{" "}
        </span>
      </h1>
      <h2 className="desc">
        Simplify your reading with an open-source article summarizer that
        transforms lengthy articles into clear and concise summaries.
      </h2>
    </header>
  );
};

export default Hero;
