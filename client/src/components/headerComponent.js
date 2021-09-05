import React from "react";
import "../styles/headerComponent.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { CheckCamoIcon, SettingsIcon, SidebarMenuIcon } from "./svg";

function Header() {
	const pathname = useLocation().pathname;
	const paths = useLocation().pathname.split("/");
	const main = useSelector((state) => state.main);
	const { isAuth } = useSelector((state) => state.user);
	const dispatch = useDispatch();
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

	return (
		<div className="tracker_header" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
			{isAuth && (
				<>
					<div className="tracker_header_menu" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}>
						<SidebarMenuIcon />
					</div>
					<div className="tracker_header_title">
						<div className="tracker_header_title_text">{findTitle()}</div>
						{paths[1] === "weapon" && (
							<div className="tracker_header_title_check" onClick={() => dispatchWeapon()} style={{ opacity: show ? "1" : "0" }}>
								<CheckCamoIcon />
							</div>
						)}
					</div>
				</>
			)}
			{!isAuth && (
				<>
					<div className="tracker_header_home">
						<Link to={"/"}>HOME</Link>
					</div>
					<div className="tracker_header_login">{pathname === "/login" ? <Link to={"/register"}>SIGN UP</Link> : <Link to={"/login"}>LOG IN</Link>}</div>
				</>
			)}
			{isAuth && (
				<div className="tracker_header_settings" onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}>
					<SettingsIcon />
				</div>
			)}
		</div>
	);
}

export default Header;
