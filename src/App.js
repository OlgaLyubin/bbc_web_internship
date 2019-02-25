import React, { Component } from "react";
import Ranking from "./Ranking";
import "./App.css";
const ARTICLE_URL =
  "https://raw.githubusercontent.com/bbc/news-coding-test-dataset/master/data/";
const FIRST = "article-1.json";
const SECOND = "article-2.json";
const THIRD = "article-3.json";
const FOURTH = "article-4.json";
const FIFTH = "article-5.json";

class App extends Component {
  constructor() {
    super();
    this.state = {
      article1: [],
      article2: [],
      article3: [],
      article4: [],
      article5: [],
      numOfFetched: 1, // Number of articles that are fetched from server
      currentArticle: 1, // Article currently displayed
      showRanking: false
    };
  }

  componentDidMount() {
    // Fetching the first article and after that prefetching the second
    fetch(ARTICLE_URL + FIRST)
      .then(response => response.json())
      .then(data => {
        this.setState({
          article1: data.body
        });
        this.prefetch(SECOND);
      });
  }

  // Fetching in JS is asynchronous; When an article is displayed on the
  // webpage, this function prefetches the next article
  prefetch(urlNumber) {
    let currentArticle = this.state.currentArticle + 1;
    let numOfFetched = this.state.numOfFetched + 1;
    if (this.state.numOfFetched < currentArticle) {
      fetch(ARTICLE_URL + urlNumber)
        .then(response => response.json())
        .then(data => {
          this.setState({
            ["article" + currentArticle]: data.body,
            numOfFetched: numOfFetched
          });
        });
    }
  }

  // Prepare different parts of articles for rendering: headings, paragraphs,
  // images and lists
  arrangeArticle(article) {
    let display_article = [];
    article.map(articlePart => {
      switch (articlePart.type) {
        case "heading":
          display_article.push(
            <h1 className="articleName"> {articlePart.model.text} </h1>
          );
          break;

        case "paragraph":
          display_article.push(<p> {articlePart.model.text} </p>);
          break;

        case "image":
          display_article.push(
            <img
              className="article_img"
              src={articlePart.model.url}
              alt={articlePart.model.altText}
              height={articlePart.model.height}
              width={articlePart.model.width}
            />
          );
          break;

        case "list":
          let items = articlePart.model.items;
          items.forEach(item => {
            display_article.push(<li> {item} </li>);
          });
          break;

        default:
          break;
      }
    });
    return display_article;
  }

  // See previous article
  prevArticle = () => {
    if (this.state.currentArticle === 5 && this.state.showRanking === true) {
      this.setState({ showRanking: false });
    } else if (this.state.currentArticle !== 1) {
      let temp = this.state.currentArticle - 1;
      this.setState({ currentArticle: temp });
    }
  };

  // See next article; trigger prefetching the next after that article (in case
  // it is not fetched yet)
  nextArticle = () => {
    if (this.state.currentArticle < 5) {
      let temp = this.state.currentArticle + 1;
      this.setState({ currentArticle: temp }, () => {
        switch (temp) {
          case 2:
            this.prefetch(THIRD);
            break;
          case 3:
            this.prefetch(FOURTH);
            break;
          case 4:
            this.prefetch(FIFTH);
            break;
          case 5:
            break;
          default:
            break;
        }
      });
    }
  };

  // Render an appropriate acticle on a webpage
  getArticleToRender = currentArticle => {
    switch (currentArticle) {
      case 1:
        return this.state.article1;
      case 2:
        return this.state.article2;
      case 3:
        return this.state.article3;
      case 4:
        return this.state.article4;
      case 5:
        return this.state.article5;
      default:
        break;
    }
  };

  // Show ranking page
  triggerRanking = () => {
    if (this.state.showRanking === false) {
      this.setState({ showRanking: true });
    } else {
      this.setState({ showRanking: false });
    }
  };

  render() {
    const {
      article1,
      article2,
      article3,
      article4,
      article5,
      currentArticle,
      numOfFetched,
      showRanking
    } = this.state;

    // Pass titles of articles as props to Ranking component
    let articleTitles = [];
    if (numOfFetched === 5 && articleTitles.length === 0) {
      articleTitles.push(article1[0].model.text);
      articleTitles.push(article2[0].model.text);
      articleTitles.push(article3[0].model.text);
      articleTitles.push(article4[0].model.text);
      articleTitles.push(article5[0].model.text);
    }

    return (
      <div className="article">
        {showRanking === true ? (
          <Ranking titles={articleTitles} />
        ) : (
          this.arrangeArticle(this.getArticleToRender(currentArticle))
        )}
        <div className="buttons">
          <button onClick={this.prevArticle} className="prevNextButton">
            Previous
          </button>
          {currentArticle === 5 ? (
            <button onClick={this.triggerRanking} className="rankingButton">
              Rank articles
            </button>
          ) : (
            <button onClick={this.nextArticle} className="prevNextButton">
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}
export default App;
