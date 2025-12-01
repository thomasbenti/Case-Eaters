import React, { Component } from "react";
import "./Home.css";
import campusImage from "/CWRU-Campus.png";
import { Link } from "react-router-dom";

const LoginCard = [
  {
    title: "Login",
    link: "/Login",
    description: "Access your account to manage your meal swipes and find free food.",
  },
  {
    title: "Create Account",
    link: "/Register",
    description: "Sign up to start sharing and finding free food on campus.",
  },
];

class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <div className="hero-image">
          <img src={campusImage} alt="Case Western Reserve University campus" />
        </div>

        <h1>Case Eaters</h1>
        <p>Find or share free food and meal swipes on campus.</p>

        <div className="research-cards">
          {LoginCard.map((item, index) => (
            <div key={index} className="login-card">
              <p>{item.title}</p>
              <p>{item.description}</p>
              <Link to={item.link}>Go</Link>

            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;