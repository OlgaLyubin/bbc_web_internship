import React, { Component } from "react";
import "./App.css";
import Stars from "./Stars";

class Ranking extends Component {
  constructor() {
    super();
    this.state = {
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0,
      success: false,
      error: false
    };
  }

  // Getting a rating for a specific article from Stars component
  updateRating = (newRate, articleNumber) => {
    this.setState({
      ["rating" + articleNumber]: newRate
    });
  };

  // Submit rankings with a stubbed POST method
  submitRanking = () => {
    const { rating1, rating2, rating3, rating4, rating5 } = this.state;
    let ratings = {
      Article1: rating1,
      Article2: rating2,
      Article3: rating3,
      Article4: rating4,
      Article5: rating5
    };
    // Stubbed POST request with a mock server
    // The function cathes an error. If you disable internet connection
    // or type some randow, wrong URL inside fetch (instead of www.mocky.io...)
    // then it will catch an error and inform the user
    fetch("http://www.mocky.io/v2/5c731e803300006600760259", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ratings)
    })
      .then(res => res.json())
      .then(
        response => console.log("Success:", JSON.stringify(response)),
        this.setState({ success: true, error: false })
      )
      .catch(
        error => (
          this.setState({ success: false, error: true }), console.log(error)
        )
      );
  };

  // Checking if all of the rankings were selected by the user
  // If any ranking was not selected, then the button to submit
  // the rankings will be disabled
  checkRankings = () => {
    const { rating1, rating2, rating3, rating4, rating5 } = this.state;
    if (
      rating1 === 0 ||
      rating2 === 0 ||
      rating3 === 0 ||
      rating4 === 0 ||
      rating5 === 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { success, error } = this.state;
    const { titles } = this.props;
    // Prepare sets of stars for ranking of 5 articles
    let renderRanking = [];
    for (let i = 0; i < 5; i++) {
      renderRanking.push(
        <div>
          <h2 className="title"> {titles[i]} </h2>
          <Stars
            onSelectRating={this.updateRating}
            articleReview={i + 1}
            className="setOfStars"
          />
        </div>
      );
    }

    return (
      <div className="rankingContainer">
        <h1 className="articleName">Article Ranking</h1>

        {renderRanking}

        {success ? (
          <p className="success"> Your ranking was successfully submitted! </p>
        ) : (
          <p> </p>
        )}
        {error === false ? (
          <p> </p>
        ) : (
          <p className="error">
            {" "}
            There was an error, ranking is not submitted.{" "}
          </p>
        )}

        {this.checkRankings() ? (
          <button className="submitRanking" onClick={this.submitRanking}>
            Submit Ranking
          </button>
        ) : (
          <button
            className="submitRanking"
            onClick={this.submitRanking}
            disabled={true}
          >
            Submit Ranking
          </button>
        )}
      </div>
    );
  }
}

export default Ranking;
