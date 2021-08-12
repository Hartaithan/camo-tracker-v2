import React from "react";
import "../styles/loginPage.scss";
import Header from "../components/headerComponent";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function LoginPage() {
  const app = useSelector((state) => state.app);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios
        .post("/api/auth/login", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          dispatch({
            type: "LOG_IN",
            token: response.data.token,
            userId: response.data.userId,
            nick: response.data.nick,
          });
          history.push("/");
          setLoading(false);
        })
        .catch(function (error) {
          if (!error.response.data.message) {
            toast.error("Something went wrong... ");
            console.log(error.response.data);
          }
          toast.error(error.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      toast.error("Something went wrong... ");
      console.log(error);
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
    console.log(errors);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 455.862 455.862"
              >
                <path
                  d="M441.088,63.154H14.774C6.615,63.154,0,69.77,0,77.93v300.003c0,8.16,6.615,14.775,14.774,14.775h426.313
			c8.16,0,14.775-6.614,14.775-14.775V77.93C455.862,69.77,449.248,63.154,441.088,63.154z M403.394,316.659
			c6.256,5.43,6.926,14.903,1.497,21.16c-5.43,6.254-14.901,6.928-21.161,1.496c-3.876-3.364-101.683-88.252-105.452-91.523
			l-40.515,35.164c-2.82,2.448-6.326,3.672-9.832,3.672s-7.012-1.224-9.832-3.672l-40.515-35.164
			c-3.77,3.272-101.576,88.159-105.452,91.523c-6.257,5.43-15.731,4.761-21.161-1.496c-5.43-6.257-4.76-15.73,1.497-21.16
			L154.7,227.93L52.468,139.203c-6.256-5.43-6.926-14.903-1.497-21.16c5.431-6.256,14.904-6.928,21.161-1.496
			c5.07,4.4,146.594,127.231,155.799,135.22c7.972-6.919,150.305-130.451,155.799-135.22c6.256-5.431,15.731-4.762,21.161,1.496
			c5.43,6.257,4.76,15.731-1.497,21.16L301.162,227.93L403.394,316.659z"
                />
              </svg>
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
              <svg viewBox="-64 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m336 192h-16v-64c0-70.59375-57.40625-128-128-128s-128 57.40625-128 128v64h-16c-26.453125 0-48 21.523438-48 48v224c0 26.476562 21.546875 48 48 48h288c26.453125 0 48-21.523438 48-48v-224c0-26.476562-21.546875-48-48-48zm-229.332031-64c0-47.0625 38.269531-85.332031 85.332031-85.332031s85.332031 38.269531 85.332031 85.332031v64h-170.664062zm0 0" />
              </svg>
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
