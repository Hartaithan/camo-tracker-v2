import React from "react";
import "../styles/publicPage.scss";
import { Link } from "react-router-dom";

function publicPage() {
	function getRandNum(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randomImages() {
		const items = [];
		const nums = [];
		while (items.length < 15) {
			const type = getRandNum(0, 100) & 1 ? "dm" : "da";
			const first = getRandNum(1, 9);
			const second = getRandNum(1, 6);
			const pretendent = `${type}/${first}_${second}`;
			if (nums.includes(pretendent) === false) {
				console.log(pretendent);
				if ((pretendent !== "dm/8_4") && (pretendent !== "dm/8_5") && (pretendent !== "da/8_4") && (pretendent !== "da/8_5")) {
					nums.push(`${type}/${first}_${second}`);
					items.push(<img src={`/img/${pretendent}.png`} alt="random img" />);
				}
			}
		}
		return items;
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
					Easy-to-use completionist tracker for Call of Duty: Black Ops Cold War.
					<br />
					Track your camo progression in Multiplayer and Zombies!
				</p>
				<Link to="/register">
					<button className="tracker_public_body_button">CLICK HERE TO REGISTER!</button>
				</Link>
			</div>
			<div className="tracker_public_background">
				<div className="tracker_public_background_line">{randomImages()}</div>
				<div className="tracker_public_background_line">{randomImages()}</div>
				<div className="tracker_public_background_line">{randomImages()}</div>
				<div className="tracker_public_background_line">{randomImages()}</div>
				<div className="tracker_public_background_line">{randomImages()}</div>
			</div>
		</div>
	);
}

export default publicPage;
