import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import "./FoodMap.css";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import PostForm from "./PostForm";
import { BUILDING } from "./buildings";

const center = { lat: 41.5045, lng: -81.6086 };



const dummyReports = [
  {
    id: 1,
    type: "FreeFood",
    title: "Pizza",
    location: {
      buildingCode: "ADH",
      lat: 41.5050,
      lng: -81.6083
    },
    description: "Free leftover pizza",
    time: "2:00 PM"
  },
  {
    id: 2,
    type: "FreeFood",
    title: "Sandwiches",
    location: {
      buildingCode: "AML",
      lat: 41.5060,
      lng: -81.608
    },
    description: "Club event sandwiches",
    time: "12:30 PM",
  },
  {
    id: 3,
    type: "MealSwipe",
    title: "Fribley Swipe",
    location: {
      buildingCode: "FRC",
      lat: 41.50128097018468, 
      lng: -81.60269321354278
    },
    description: "Guest Swipe at Fribley",
    time: "3:00 PM",
  },
];

const getBuildingName = (id) => {
  for (const [name, info] of Object.entries(BUILDING)) {
    if (info.id === id) return name;
  }
  return id; // fallback
};


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
        expiresAt: "",
      },
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
    if (name === "buildingCode") {
      const entry = Object.values(BUILDING).find(b => b.id === value)

      if (entry) {
        this.setState({
          newPost: {
            ...this.state.newPost,
            buildingCode: value,
            lat: entry.lat,
            lng: entry.lng
          }
        });
        return;
      }
    }
    this.setState({
      newPost: {
        ...this.state.newPost,
        [name]: value,
      },
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
        lng: latLng.lng(),
      },
    });
  };

  submitPost = async () => {
    try {
      const { newPost, allPosts } = this.state;

      newPost.expiresAt = "11:59 PM"

      if (!newPost.title) {
        alert("Please fill all fields and select a location on the map.");
        return;
      }
      if(!newPost.expiresAt){
        alert("please fill in an expiration time")
        return;
      }
      if (!newPost.buildingCode){
        alert("please fill iin the building code");
        return;
      } if (!newPost.lat || !newPost.lng){
        alert("Please fill in the coordinates for the location on the map.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        {
          type: "FreeFood",
          title: newPost.title,
          description: newPost.description,
          location: {
            buildingCode: newPost.buildingCode,
            lat: newPost.lat,
            lng: newPost.lng,
          },
          expiresAt: newPost.expiresAt,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      this.setState({
        allPosts: [res.data, ...allPosts],
        showAddForm: false,
        newPost: {
          title: "",
          description: "",
          buildingCode: "",
          lat: null,
          lng: null,
          expiresAt: "",
        },
      });

      toastr.success("Post added successfully!", "Success", {
        positionClass: "toast-bottom-right",
      });
    } catch (err) {
      console.error("Failed to submit post:", err);
      toastr.error("Failed to submit post", "Error", {
        positionClass: "toast-bottom-right",
      });
    }
  };

  render() {
    const { selected, showAddForm, allPosts, newPost } = this.state;

    const combinedPosts = [...dummyReports, ...allPosts];

    return (
      <div className="food-map-page">
        <div className="map-container" style={{ position: "relative", height: "500px" }}>
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
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
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
                zIndex: 1050,
              }}
            >
              <PostForm
                post={newPost}
                onSubmit={this.submitPost}
                onCancel={() => this.setState({ showAddForm: false })}
                onChange={this.handleInput}
              />
            </div>
          )}

          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              onClick={this.handleMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
              options={{ mapTypeControl: false }}
            >
              {combinedPosts.map((post) => {
                const position = post.position || (post.location ? { lat: post.location.lat, lng: post.location.lng } : null);
                if (!position) return null;
                return (
                  <Marker key={post.id || post._id} position={position} onClick={() => this.selectReport(post)} />
                );
              })}

              {selected && (
                <InfoWindow
                  position={
                    selected.position || (selected.location ? { lat: selected.location.lat, lng: selected.location.lng } : center)
                  }
                  onCloseClick={this.closeInfo}
                >
                  <div>
                    {/*<h3>{selected.type || selected.title}</h3>*/}
                    <h3>{selected.title}</h3>
                    <p>{selected.description}</p>
                    {/*<p><strong>{selected.location?.buildingCode || selected.location}</strong></p>*/}
                    <p><strong>{getBuildingName(selected.location?.buildingCode)}</strong></p>
                    {selected.expiresAt && <small>Expires: {new Date(selected.expiresAt).toLocaleString()}</small>}
                    {selected.time && <small>{selected.time}</small>}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="food-list-container">
          <ul className="food-list">
            {combinedPosts.map((post) => (
              <li key={post.id || post._id} onClick={() => this.selectReport(post)}>
                <strong>{post.title}</strong> — {getBuildingName(post.location?.buildingCode)}
                <p>{post.description}</p>
                {post.expiresAt && <span>Expires: {new Date(post.expiresAt).toLocaleString()}</span>}
                {post.time && <span>{post.time}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default FoodMap;
