import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";
import axios from "axios";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import PostForm from "./PostForm";

const center = { lat: 41.5045, lng: -81.6086 }; // CWRU campus center

class FoodMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      showAddForm: false,
      allPosts: [],
      newPost: {
        title: "",
        description: "",
        buildingCode: "",
        lat: null,
        lng: null,
        expiresAt: ""
      }
    };
  }

  async componentDidMount() {
    this.loadPosts();
  }
  
  loadPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      this.setState({ allPosts: res.data.posts || [] });
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  selectReport = (report) => {
    this.setState({ selected: report });
  };

  closeInfo = () => {
    this.setState({ selected: null });
  };

 
  toggleAddForm = () => {
    this.setState({ showAddForm: !this.state.showAddForm });
  };

  handleInput = (e) => {
    const { name, value } = e.target;
    this.setState({
      newPost: {
        ...this.state.newPost,
        [name]: value
      }
    });
  };
  handleSave = (taskData) => {
    
    setPosts((prev) => [...prev, taskData]);
      toastr.success('Post added successfully!', 'Success', {
        positionClass: 'toast-bottom-right',
      });
    setShowForm(false);
  };

  handleMapClick = (e) => {
    const { latLng } = e;
    this.setState({
      newPost: {
        ...this.state.newPost,
        lat: latLng.lat(),
        lng: latLng.lng()
      }
    });
  };

  async submitPost() {
    try {
      const { newPost } = this.state;
      const coords = BUILDING_COORDS[newPost.buildingCode.toUpperCase()];
      if (!coords) {
        alert("Invalid building code, not a campus building.");
        return;
      }
      if (!newPost.title || !newPost.buildingCode || !newPost.expiresAt) {
        alert("Please fill in all fields and select a location on the map.");
        return;
      }
  
      const res = await axios.post(
        "/api/posts",
        {
          type: "FreeFood",
          title: newPost.title,
          description: newPost.description,
          location: {
            buildingCode: newPost.buildingCode.toUpperCase(),
            lat: coords.lat,
            lng: coords.lng
          },
          expiresAt: newPost.expiresAt
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      this.setState({
        newPost: {
          title: "",
          description: "",
          buildingCode: "",
          lat: null,
          lng: null,
          expiresAt: ""
        },
        showAddForm: false,
        allPosts: [res.data, ...this.state.allPosts]
      });
    } catch (err) {
      console.error("Failed to submit post:", err);
    }
  }
  

  render() {
    const { selected, showAddForm, allPosts, newPost} = this.state;

    return (
      <div className="food-map-page">


        {/* Map Section */}
        {/* Post Button */}
        
        <div className="map-container" style={{ position: "relative"}}>
        <button
          className="add-post-btn"
          onClick={this.toggleAddForm}
          style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            zIndex: 900,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)"
          }}
        >
          + Add Post
        </button>
        {showAddForm && (
  <div
    className="postform-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1050
    }}
  >
    <PostForm
      newPost={newPost}
      onChange={this.handleInput}
      onSubmit={() => this.submitPost()}
      onCancel={() => this.setState({ showAddForm: false })}
    />
  </div>
)}

   
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              onClick={this.handleMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
            >
              {allPosts.map(post =>
                post.location && post.location.lat != null && post.location.lng != null && (
                  <Marker
                    key={post._id}
                    position={{ lat: post.location.lat, lng: post.location.lng }}
                    onClick={() => this.selectReport(post)}
                  />
                )
              )}

              {selected && (
                <InfoWindow
                  position={{ lat: selected.location.lat, lng: selected.location.lng }}
                  onCloseClick={this.closeInfo}
                >
                  <div>
                    <h3>{selected.title}</h3>
                    <p>{selected.description}</p>
                    <p><strong>{selected.location.buildingCode}</strong></p>
                    <small>Expires: {new Date(selected.expiresAt).toLocaleString()}</small>
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
            {allPosts.map(post => (
              <li key={post._id} onClick={() => this.selectReport(post)}>
                <strong>{post.title}</strong> — {post.location.buildingCode}
                <p>{post.description}</p>
                <span>Expires: {new Date(post.expiresAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default FoodMap;