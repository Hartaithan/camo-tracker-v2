import React from "react";
import "../styles/headerComponent.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function Header() {
	const paths = useLocation().pathname.split("/");
	const main = useSelector((state) => state.main);
	const { isAuth } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const [show, setShow] = React.useState(false);

	function findTitle() {
		let title = "";
		if (paths[1] === "") {
			title = "MAIN";
		} else if (paths[1] === "dm") {
			title = "DM ULTRA";
		} else if (paths[1] === "da") {
			title = "DARK AETHER";
		} else if (paths[1] === "weapon") {
			const [id_mast, id_cat, id_weap] = paths[2].split("_");
			title = id_mast.toUpperCase() + " | " + main[id_cat - 1].weapons[id_weap - 1].name.toUpperCase();
		}
		return title;
	}

	function dispatchWeapon() {
		if (paths[1] === "weapon") {
			const [id_mast, id_cat, id_weap] = paths[2].split("_");
			dispatch({
				type: "TOGGLE_WEAPON",
				id_cat: id_cat,
				id_weap: id_weap,
				id_mast: id_mast,
			});
		}
	}

	function logOut() {
		dispatch({ type: "LOG_OUT" });
		dispatch({ type: "RESET_ALL" });
		history.push("/login");
	}

	return (
		<div className="tracker_header" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
			{isAuth && (
				<div className="tracker_header_menu" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
					</svg>
				</div>
			)}
			{isAuth && (
				<div className="tracker_header_title">
					<div className="tracker_header_title_text">{findTitle()}</div>
					{paths[1] === "weapon" && (
						<div className="tracker_header_title_check" onClick={() => dispatchWeapon()} style={{ opacity: show ? "1" : "0" }}>
							<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 448 448">
								<polygon points="341.333,192.96 341.333,381.12 42.667,381.12 42.667,82.453 308.693,82.453 355.627,39.787 0,39.787 0,423.787 384,423.787 384,153.707" />
								<polygon points="417.493,24.213 186.027,234.56 113.493,162.24 85.333,190.4 187.947,293.013 448,54.08" />
							</svg>
						</div>
					)}
				</div>
			)}
			<div className="tracker_header_login">
				{isAuth ? (
					<p
						onClick={() => {
							logOut();
						}}
					>
						LOG OUT
					</p>
				) : (
					<Link to={"/login"}>LOG IN</Link>
				)}
			</div>
			{isAuth && (
				<div className="tracker_header_settings" onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}>
					<svg viewBox="0 0 270 270">
						<path d="M166 39c5,2 10,4 15,6l24 -18c5,-3 11,-2 14,1l22 22c4,4 4,10 1,14l-17 25c2,5 4,10 6,15l30 5c5,0 9,5 9,10l0 31c0,5 -4,10 -9,11l-30 5c-2,5 -4,10 -6,15l18 24c3,5 2,11 -1,14l-22 22c-4,4 -10,4 -14,1l-25 -17c-5,2 -10,4 -15,6l-5 30c-1,5 -6,9 -11,9l-31 0c-5,0 -10,-4 -10,-9l-5 -30c-5,-2 -10,-4 -15,-6l-25 17c-4,3 -10,3 -14,-1l-22 -22c-3,-3 -4,-9 -1,-13l18 -25c-3,-5 -5,-10 -6,-15l-30 -5c-5,-1 -9,-6 -9,-11l0 -31c0,-5 4,-10 9,-10l30 -5c1,-6 3,-10 6,-15l-18 -25c-3,-4 -2,-10 2,-14l22 -22c3,-3 9,-4 13,-1l25 18c5,-2 10,-4 15,-6l5 -30c0,-5 5,-9 10,-9l31 0c5,0 10,4 11,9l5 30zm-31 39c-31,0 -57,26 -57,57 0,31 26,57 57,57 31,0 57,-26 57,-57 0,-31 -26,-57 -57,-57z" />
					</svg>
				</div>
			)}
		</div>
	);
}

export default Header;
