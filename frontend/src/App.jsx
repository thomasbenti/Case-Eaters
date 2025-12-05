import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import FoodMap from "./FoodMap";
import Swipes from "./Swipes";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="Navbar">
          <Link to="/">Home</Link> | <Link to="/map" onClick={() => foodMapRef.current.reloadMap()}>Food Map</Link>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/map" element={<FoodMap />} />
        </Routes>
      </Router>
    );
  }
}

export default App;