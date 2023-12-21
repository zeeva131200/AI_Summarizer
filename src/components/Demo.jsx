import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [summaryLength, setSummaryLength] = useState(3);
  const [activeTab, setActiveTab] = useState("text");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  // useEffect(() => {
  //   const articlesFromLocalStorage = JSON.parse(
  //     localStorage.getItem("articles")
  //   );

  //   if (articlesFromLocalStorage) {
  //     setAllArticles(articlesFromLocalStorage);
  //   }
  // }, []);

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (Array.isArray(articlesFromLocalStorage)) {
      // Ensure it's an array
      setAllArticles(articlesFromLocalStorage);
    } else {
      setAllArticles([]); // Default to an empty array if not an array
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  //copy  btn
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  // tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Slider change handler
  const handleSliderChange = (e) => {
    setSummaryLength(parseInt(e.target.value, 10));
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form className="relative flex justify-center" onSubmit={handleSubmit}>
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-3 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter a Url"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>

        {/* Browse URL history*/}
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add the slider UI here */}
      <div className="flex items-center mt-4 mx-1">
        <label className="mr-2">Summary Length: {summaryLength}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={summaryLength}
          onChange={handleSliderChange}
        />
      </div>

      {/* Display rsults*/}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              {/* Add the tabs UI here */}
              <div className="flex justify-end">
                <button
                  className={`tab ${activeTab === "text" ? "active" : ""}`}
                  onClick={() => handleTabChange("text")}
                >
                  Text
                </button>
                <button
                  className={`tab ${activeTab === "bulleted" ? "active" : ""}`}
                  onClick={() => handleTabChange("bulleted")}
                >
                  Bulleted
                </button>
              </div>
              <div className="summary_box max-h-60 overflow-y-auto">
                {activeTab === "text" && (
                  <p className="font-inter font-medium text-sm text-gray-700">
                    {article.summary}
                  </p>
                )}
                {activeTab === "bulleted" && (
                  <ul className="list-disc pl-5">
                    {article.summary
                      .split(".")
                      .filter((sentence) => sentence.trim() !== "")
                      .map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
