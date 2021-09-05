import React from "react";
import "../styles/registerPage.scss";
import Header from "../components/headerComponent";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import database from "../data/db_main.json";
import axios from "axios";
import toast from "react-hot-toast";
import { EmailIcon, NickIcon, PasswordIcon } from "../components/svg";

function RegisterPage() {
	const app = useSelector((state) => state.app);
	const { register, handleSubmit } = useForm();
	const [loading, setLoading] = React.useState(false);
	const history = useHistory();

	const onSubmit = async (data) => {
		const dataWithState = {
			...data,
			state: database,
		};
		setLoading(true);
		try {
			await axios
				.post("/api/auth/register", JSON.stringify(dataWithState), {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((response) => {
					if (!response.data.message) {
						toast.success(response.data);
					}
					toast.success(response.data.message);
					setLoading(false);
					history.push("/login");
				})
				.catch(function (error) {
					if (!error.response.data.message) {
						toast.error("Something went wrong... ");
						console.error("/api/auth/register error", error.response.data);
					}
					toast.error(error.response.data.message);
					setLoading(false);
				});
		} catch (error) {
			toast.error("Something went wrong... ");
			console.error("/api/auth/register catch (error)", error);
			setLoading(false);
		}
	};

	const onErrors = (errors) => {
		if (errors.email) {
			toast.error(errors.email.message);
		} else if (errors.nick) {
			toast.error(errors.nick.message);
		} else if (errors.password) {
			toast.error(errors.password.message);
		}
		console.error(errors);
	};

	return (
		<div className="tracker_container" style={{ marginLeft: app.isOpen ? "300px" : "0px" }}>
			<Header />
			<div className="tracker_register">
				<form className="tracker_register_form" onSubmit={handleSubmit(onSubmit, onErrors)}>
					<div className="tracker_register_form_field">
						<label htmlFor="email">
							<EmailIcon />
						</label>
						<input
							type="email"
							id="email"
							{...register("email", {
								required: {
									value: true,
									message: "Enter your email adress",
								},
								maxLength: {
									value: 30,
									message: "Email is too long (max is 30 characters)",
								},
								minLength: {
									value: 3,
									message: "Email is too short (min is 3 characters)",
								},
								pattern: {
									value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
									message: "invalid email",
								},
							})}
							placeholder="Email"
						/>
					</div>
					<div className="tracker_register_form_field">
						<label htmlFor="nick">
							<NickIcon />
						</label>
						<input
							id="nick"
							{...register("nick", {
								required: {
									value: true,
									message: "Enter your nickname",
								},
								maxLength: {
									value: 20,
									message: "Nickname is too long (max is 20 characters)",
								},
								minLength: {
									value: 3,
									message: "Nickname is too short (min is 3 characters)",
								},
								pattern: {
									value: /^[a-zA-Z0-9_.-]*$/i,
									message: "invalid nickname",
								},
							})}
							placeholder="Nickname"
						/>
					</div>
					<div className="tracker_register_form_field">
						<label htmlFor="password">
							<PasswordIcon />
						</label>
						<input
							type="password"
							id="password"
							{...register("password", {
								required: {
									value: true,
									message: "Enter your password",
								},
								minLength: {
									value: 6,
									message: "Password must have at least 6 characters",
								},
							})}
							placeholder="Password"
						/>
					</div>
					<div className="tracker_register_form_submit">
						<input type="submit" value={loading ? "LOADING..." : "SUBMIT"} disabled={loading} style={{ background: loading ? "#575757" : "#ffc400" }} />
					</div>
				</form>
				<p className="tracker_register_bottom">
					Already have an account? <Link to={"/login"}>Log in!</Link>
				</p>
			</div>
		</div>
	);
}

export default RegisterPage;
