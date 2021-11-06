import React from "react";
import "../styles/loginPage.scss";
import Header from "../components/headerComponent";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import { EmailIcon, PasswordIcon } from "../components/svg";
import API from "../api";

function LoginPage() {
  const app = useSelector((state) => state.app);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post("/auth/login", JSON.stringify(data))
        .then((response) => {
          dispatch({
            type: "LOG_IN",
            token: response.data.token,
            refresh_token: response.data.refresh_token,
            userId: response.data.userId,
            email: response.data.email,
            nick: response.data.nick,
          });
          history.push("/");
          setLoading(false);
        })
        .catch(function (error) {
          if (!error.response.data.message) {
            toast.error("Something went wrong... ");
            console.error(error.response.data);
          }
          toast.error("/api/auth/login error", error.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      toast.error("Something went wrong... ");
      console.error("/api/auth/login catch (error)", error);
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
    <div
      className="tracker_container"
      style={{ marginLeft: app.isOpen ? "300px" : "0px" }}
    >
      <Header />
      <div className="tracker_login">
        <form
          className="tracker_login_form"
          onSubmit={handleSubmit(onSubmit, onErrors)}
        >
          <div className="tracker_login_form_field">
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
          <div className="tracker_login_form_field">
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
          <div className="tracker_login_form_submit">
            <input
              type="submit"
              value={loading ? "LOADING..." : "LOG IN"}
              disabled={loading}
              style={{ background: loading ? "#575757" : "#ffc400" }}
            />
          </div>
        </form>
        <div className="tracker_login_bottom">
          Don't have an acoount? <Link to={"/register"}>Sign up!</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
