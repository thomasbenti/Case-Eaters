import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import FoodMap from "./FoodMap";
import Swipes from "./Swipes";
import "./App.css";
import CreatePostForm from "./CreatePostForm";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="Navbar">
          <Link to="/">Home</Link> | <Link to="/map">Food Map</Link> | <Link to="/Swipes">Swipes</Link> | <Link to="/create-post">Create Post</Link>
        </div>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<FoodMap />} />
          <Route path="/Swipes" element={<Swipes />} />
          <Route path="/create-post" element={<CreatePostForm />} />
        </Routes>
      </Router>
      
    );
  }
}

export default App;