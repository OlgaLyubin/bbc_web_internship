import React, { Component } from "react";
import "./App.css";
import emptyStar from "./images/emptyStar.png";
import fullStar from "./images/fullStar.png";

class Stars extends Component {
  constructor() {
    super();
    this.state = {
      stars: 0, // for tracking how many stars should be full on mouse hover
      rating: 0 // rating for an article that a user selects
    };
  }

  // Setting a number of stars icons that should be full on mouse hover
  changeStars = temp => starNumber => {
    this.setState({
      stars: temp
    });
  };

  setRating = tempRate => rateNumber => {
    // Setting a rating for an article
    this.setState({
      rating: tempRate
    });
    // Sending that rating to Ranking component
    const { articleReview } = this.props;
    this.props.onSelectRating(tempRate, articleReview);
  };

  render() {
    const { stars, rating } = this.state;
    // Prepare rending of 5 stars
    let renderStars = [];
    for (let i = 0; i < 5; i++) {
      renderStars.push(
        <img
          src={stars > i || rating > i ? fullStar : emptyStar}
          alt="starIcon"
          onMouseOver={this.changeStars(i + 1)}
          onMouseOut={this.changeStars(0)}
          onClick={this.setRating(i + 1)}
          className="starIcon"
        />
      );
    }

    return <div>{renderStars}</div>;
  }
}

export default Stars;
