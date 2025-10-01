import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const LoginCard = [
  {
    title: "Login",
    link: "/Login",
    description: "Access your account to manage your meal swipes and find free food.",
  },
  {
    title: "Create Account",
    link: "/register",
    description: "Sign up to start sharing and finding free food on campus.",
  },
];

class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <h1>Case Eaters</h1>
        <p>Find or share free food and meal swipes on campus.</p>

        <div className="login-cards">
          {LoginCard.map((item, index) => (
            <div key={index} className="login-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to={item.link} className="btn">
                {item.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;