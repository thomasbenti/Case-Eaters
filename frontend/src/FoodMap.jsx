import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";

const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      posts: [],
      newPost: {
        postId: "",
        type: "FreeFood",
        title: "",
        description: "",
        location: "KSL",
        lat: "",
        lng: "",
        reporter: "",
        expiresAt: "",
      },
    };
  }

  componentDidMount() {
    this.fetchPosts();
  }

  // Fetch posts from backend
  fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      this.setState({ posts: data });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Handle form field change
  handleChange = (e) => {
    this.setState({
      newPost: { ...this.state.newPost, [e.target.name]: e.target.value },
    });
  };

  // Submit new post
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.newPost),
      });

      if (response.ok) {
        alert("Post created successfully");
        this.setState({
          newPost: {
            postId: "",
            type: "FreeFood",
            title: "",
            description: "",
            location: "KSL",
            lat: "",
            lng: "",
            reporter: "",
            expiresAt: "",
          },
        });
        this.fetchPosts();
      } else {
        const { error } = await response.json();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Server error creating post");
    }
  };

  selectReport = (report) => {
    this.setState({ selected: report });
  };

  closeInfo = () => {
    this.setState({ selected: null });
  };

  render() {
    const { selected, posts, newPost } = this.state;

    return (
      <div className="food-map-page">
        {/* Map Section */}
        <div className="map-container">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
            >
              {posts.map((post) => (
                <Marker
                  key={post._id}
                  position={{
                    lat: post.location.lat,
                    lng: post.location.lng,
                  }}
                  onClick={() => this.selectReport(post)}
                />
              ))}

              {selected && (
                <InfoWindow
                  position={{
                    lat: selected.location.lat,
                    lng: selected.location.lng,
                  }}
                  onCloseClick={this.closeInfo}
                >
                  <div>
                    <h3>{selected.title}</h3>
                    <p>{selected.description}</p>
                    <p><em>{selected.location}</em></p>
                    <small>{selected.type}</small>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* List Section */}
        <div className="food-list-container">
          <h3>Available Food</h3>
          <ul className="food-list">
            {posts.map((post) => (
              <li key={post._id} onClick={() => this.selectReport(post)}>
                <strong>{post.title}</strong> — {post.location}
                <p>{post.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Form Section */}
        <div className="make-post-container">
          <h3>Create a New Post</h3>
          <form className="make-post-form" onSubmit={this.handleSubmit}>
            <input
              name="postId"
              placeholder="Post ID"
              value={newPost.postId}
              onChange={this.handleChange}
              required
            />
            <select
              name="type"
              value={newPost.type}
              onChange={this.handleChange}
            >
              <option value="FreeFood">FreeFood</option>
              <option value="MealSwipe">MealSwipe</option>
            </select>
            <input
              name="title"
              placeholder="Title"
              value={newPost.title}
              onChange={this.handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newPost.description}
              onChange={this.handleChange}
            />
            <input
              name="location"
              placeholder="Building code (KSL, TVC, etc.)"
              value={newPost.location}
              onChange={this.handleChange}
              required
            />
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="Latitude"
              value={newPost.lat}
              onChange={this.handleChange}
              required
            />
            <input
              type="number"
              step="any"
              name="lng"
              placeholder="Longitude"
              value={newPost.lng}
              onChange={this.handleChange}
              required
            />
            <input
              name="reporter"
              placeholder="Reporter (User ID)"
              value={newPost.reporter}
              onChange={this.handleChange}
              required
            />
            <input
              type="datetime-local"
              name="expiresAt"
              value={newPost.expiresAt}
              onChange={this.handleChange}
              required
            />
            <button type="submit">Create Post</button>
          </form>
        </div>
      </div>
    );
  }
}

export default FoodMap;