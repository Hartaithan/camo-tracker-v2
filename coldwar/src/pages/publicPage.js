import React from "react";
import "../styles/publicPage.scss";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function PublicPage() {
  const dispatch = useDispatch();

  function getRandNum(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  function randomImages() {
    const items = [];
    const nums = [];
    while (items.length < 23) {
      const type = getRandNum(100) & 1 ? "dm" : "da";
      const first = getRandNum(8);
      const second = getRandNum(5);
      const pretendent = `${type}/${first}_${second}`;
      if (nums.includes(pretendent) === false) {
        if (!pretendent.includes[("dm/8_4", "dm/8_5", "da/8_4", "da/8_5")]) {
          nums.push(`${type}/${first}_${second}`);
          items.push(<img src={`img/${pretendent}.png`} alt="random img" />);
        }
      }
    }
    return items.concat(items);
  }

  return (
    <div className="tracker_public">
      <div className="tracker_public_header">
        <Link to="/login">
          <button className="tracker_public_header_login">LOG IN</button>
        </Link>
      </div>
      <div className="tracker_public_body">
        <p className="tracker_public_body_title">CAMO TRACKER</p>
        <p className="tracker_public_body_descr">
          Easy-to-use completionist tracker for Call of Duty: Black Ops Cold
          War.
          <br />
          Track your camo progression in Multiplayer and Zombies!
        </p>
        <div className="tracker_public_body_buttons">
          <Link to="/register">
            <button className="tracker_public_body_button">
              CLICK HERE TO REGISTER!
            </button>
          </Link>
          <button
            className="tracker_public_body_button demo"
            onClick={() => dispatch({ type: "DEMO_IN" })}
          >
            DEMO
          </button>
        </div>
      </div>
      <div className="tracker_public_background">
        <div className="tracker_public_background_wrapper w1">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
        <div className="tracker_public_background_wrapper w2">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
        <div className="tracker_public_background_wrapper w3">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
        <div className="tracker_public_background_wrapper w4">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
        <div className="tracker_public_background_wrapper w5">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
        <div className="tracker_public_background_wrapper w6">
          <div className="tracker_public_background_line">{randomImages()}</div>
        </div>
      </div>
    </div>
  );
}

export default PublicPage;
