import React from "react";
import "../styles/publicPage.scss";
import { Link } from "react-router-dom";

function publicPage() {
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
			<div className="tracker_public_background"></div>
		</div>
	);
}

export default publicPage;
